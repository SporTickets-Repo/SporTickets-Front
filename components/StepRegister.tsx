"use client";
import { AuthStep } from "@/hooks/useAuthSteps";
import { useEffect, useState } from "react";

import { registerSchema } from "@/utils/validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { useAuth } from "@/context/auth";
import { Country, RegisterBody } from "@/interface/auth";
import { cn } from "@/lib/utils";
import { clearMask, formatCEP, formatCPF, formatPhone } from "@/utils/format";
import { DatePicker } from "./ui/datePicker";
import PasswordStrengthMeter from "./ui/passwordStrengthMeter";
import { SelectItem } from "./ui/select";
import { SelectDemo } from "./ui/selectDemo";

type FormData = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  document?: string | null;
  country: Country;
  bornAt: Date;
  phone: string;
  sex: "MALE" | "FEMALE";
  cep: string;
};

interface StepRegisterProps {
  email: string;
  nextStep: (next: AuthStep) => void;
}

const StepRegister = ({ email, nextStep }: StepRegisterProps) => {
  const { registration } = useAuth();
  const [success, setSuccess] = useState(false);
  const [phoneCountryCode, setPhoneCountryCode] = useState("+55");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
  });

  useEffect(() => {
    setValue("email", email);
    setValue("country", Country.BRAZIL);
  }, [email, setValue]);

  const onSubmit = async (data: FormData) => {
    const localPhone = clearMask(data.phone);

    const phoneWithCountryCode =
      data.country === Country.BRAZIL ? `+55${localPhone}` : `+61${localPhone}`;

    const body = {
      name: data.name,
      document:
        data.country === Country.BRAZIL
          ? data.document
            ? clearMask(data.document)
            : undefined
          : undefined,
      email: data.email.toLowerCase(),
      password: data.password,
      confirmPassword: data.confirmPassword,
      bornAt: data.bornAt.toISOString(),
      cep: data.country === "BRAZIL" ? clearMask(data.cep) : data.cep,
      sex: data.sex,
      phone: phoneWithCountryCode,
      country: data.country,
    } as RegisterBody;

    try {
      await registration(body);
      setSuccess(true);
      setTimeout(() => {
        nextStep(AuthStep.ENTER_EMAIL);
      }, 4000);
    } catch (error: any) {
      console.error("Failed to register:", error.response.data.message);
      if (error.response.data.message === "CPF already exists") {
        setError("document", {
          type: "manual",
          message: "Documento já cadastrado",
        });
      }
      if (error.response.data.message === "Email already exists") {
        setError("email", {
          type: "manual",
          message: "E-mail já cadastrado",
        });
      }
      if (error.response.data.message === "Phone already exists") {
        setError("phone", {
          type: "manual",
          message: "Telefone já cadastrado",
        });
      }
    }
  };

  useEffect(() => {
    setValue("email", email);
  }, [email]);

  useEffect(() => {
    const country = watch("country");
    if (country === "BRAZIL") {
      setPhoneCountryCode("+55");
    } else if (country === "AUSTRALIA") {
      setPhoneCountryCode("+61");
    }
  }, [watch("country")]);

  const isLoading = isSubmitting || success;

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (err) => console.log("Erros:", err))}
      className="w-full max-w-md"
    >
      <div className="w-full space-y-4">
        <div className="space-y-2 mb-6">
          <Button
            type="button"
            variant="outline"
            className={cn("py-4 mb-4 px-0")}
            onClick={() => nextStep(AuthStep.ENTER_EMAIL)}
          >
            <ArrowLeft />
          </Button>

          <h1 className="text-2xl font-semibold tracking-tight">
            Parece que você é novo por aqui!
          </h1>
          <p className="text-sm text-muted-foreground">
            Crie a sua conta e fique por dentro do melhores eventos da cidade.
          </p>
          {success && (
            <div className="bg-green-100 p-4 rounded-md text-green-600">
              <p>
                Cadastro realizado com sucesso! Você será redirecionado para a
                tela de login.
              </p>
            </div>
          )}
        </div>

        <Input
          type="email"
          placeholder="E-mail"
          readOnly
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          type="text"
          placeholder="Nome Completo"
          {...register("name")}
          error={errors.name?.message}
        />
        <SelectDemo
          name="country"
          control={control}
          placeholder="Selecione o país"
        >
          <SelectItem value={Country.BRAZIL}>Brasil</SelectItem>
          <SelectItem value={Country.AUSTRALIA}>Austrália</SelectItem>
        </SelectDemo>
        {watch("country") === "BRAZIL" && (
          <Input
            type="text"
            maxLength={14}
            placeholder="Documento (CPF)"
            value={formatCPF(watch("document") || "")}
            onChange={(e) =>
              setValue("document", e.target.value.replace(/\D/g, ""))
            }
            error={errors.document?.message}
          />
        )}

        {watch("country") === "BRAZIL" ? (
          <Input
            type="text"
            maxLength={9}
            placeholder="CEP"
            value={formatCEP(watch("cep") || "")}
            onChange={(e) => setValue("cep", e.target.value.replace(/\D/g, ""))}
            error={errors.cep?.message}
          />
        ) : (
          <Input
            type="text"
            maxLength={4}
            placeholder="Postcode"
            value={watch("cep") || ""}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setValue("cep", value);
            }}
            error={errors.cep?.message}
          />
        )}

        <div className="flex">
          <div className="flex items-center justify-center bg-muted px-3 rounded-l-md border border-r-0">
            {phoneCountryCode}
          </div>
          <Input
            type="text"
            className="rounded-l-none"
            placeholder="Telefone"
            value={formatPhone(watch("phone") || "", watch("country"))}
            onChange={(e) =>
              setValue("phone", e.target.value.replace(/\D/g, ""))
            }
            error={errors.phone?.message}
          />
        </div>

        {/* DatePicker */}
        <DatePicker
          placeholder="Selecione a data de nascimento"
          date={watch("bornAt")}
          setDate={(date) => setValue("bornAt", date || new Date())}
        />

        <SelectDemo name="sex" control={control} placeholder="Selecione o sexo">
          <SelectItem value="MALE">Masculino</SelectItem>
          <SelectItem value="FEMALE">Feminino</SelectItem>
        </SelectDemo>

        {/* Senha e Validação */}
        <Input
          type="password"
          placeholder="Senha"
          {...register("password")}
          error={errors.password?.message}
          password
        />
        <PasswordStrengthMeter password={watch("password")} />

        <Input
          type="password"
          placeholder="Confirme sua Senha"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
          password
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isSubmitting
            ? "Cadastrando..."
            : success
            ? "Redirecionando..."
            : "Cadastrar"}
          <ArrowRight className="ml-1" />
        </Button>
      </div>
    </form>
  );
};

export default StepRegister;
