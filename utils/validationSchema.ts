import * as Yup from "yup";

export const emailSchema = Yup.object().shape({
  email: Yup.string().email("E-mail inválido").required("E-mail obrigatório"),
});

export const passwordSchema = Yup.object().shape({
  email: Yup.string().email("E-mail inválido").required("E-mail obrigatório"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("Senha obrigatória"),
});

export const registerSchema = Yup.object().shape({
  email: Yup.string().email("E-mail inválido").required("E-mail obrigatório"),
  name: Yup.string().required("Nome obrigatório"),
  document: Yup.string()
    .required("Documento obrigatório")
    .matches(/^\d{11}$/, "CPF inválido"),
  bornAt: Yup.date().required("Data de nascimento obrigatória"),
  phone: Yup.string()
    .required("Telefone obrigatório")
    .matches(/^\d{10,11}$/, "Telefone inválido"),
  sex: Yup.string()
    .oneOf(["MALE", "FEMALE"], "Sexo inválido")
    .required("Sexo obrigatório"),
  password: Yup.string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .max(20, "A senha deve ter no máximo 20 caracteres")
    .matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .matches(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .matches(/\d/, "A senha deve conter pelo menos um número")
    .matches(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um símbolo")
    .required("Senha obrigatória"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Senhas não conferem")
    .required("Confirmação de senha obrigatória"),
  cep: Yup.string()
    .required("CEP obrigatório")
    .matches(/^\d{8}$/, "CEP inválido"),
});
