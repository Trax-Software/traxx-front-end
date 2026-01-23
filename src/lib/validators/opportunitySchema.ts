import * as yup from 'yup';

export const opportunitySchema = yup.object().shape({
    area: yup.string().required('O campo Área é obrigatório.'),
    nome: yup.string().required('O campo Nome do Processo é obrigatório.'),
    descricao: yup.string().required('O campo descrição é obrigatório'),
    frequencia: yup.string().required('Selecione uma Frequência.'),
    pessoasEnvolvidas: yup.number()
        .typeError('Deve ser um número')
        .positive('O número deve ser positivo')
        .integer('O número deve ser inteiro')
        .required('A quantidade de pessoas é obrigatória.'),
    salarioEncargos: yup.string().required('O campo Salário é obrigatório.'),
    execucoes: yup.number()
        .typeError('Deve ser um número')
        .positive('O número deve ser positivo')
        .integer('O número deve ser inteiro')
        .required('A quantidade de execuções é obrigatória.'),
    tempo: yup.string().required('O tempo médio é obrigatório.'),
    comoRealiza: yup.string().required('Selecione como o processo é realizado.'),
});

export type OpportunityFormData = yup.InferType<typeof opportunitySchema>;
