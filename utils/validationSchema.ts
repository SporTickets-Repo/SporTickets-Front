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
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("Senha obrigatória"),
  document: Yup.string().required("Documento obrigatório"),
  bornAt: Yup.date().required("Data de nascimento obrigatória"),
  phone: Yup.string().required("Telefone obrigatório"),
  sex: Yup.string()
    .oneOf(["MALE", "FEMALE"], "Sexo inválido")
    .required("Sexo obrigatório"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Senhas não conferem")
    .required("Confirmação de senha obrigatória"),
});
