import { ReactElement, ReactNode, createContext, useContext } from 'react'

export type FormConfigItem = {
  type: string
  component: (props: any) => ReactElement
}

type FormContextProps = {
  forms: FormConfigItem[]
  children?: ReactNode
}

const FormContext = createContext<FormContextProps | undefined>(undefined)

export const useFormsBuilderContext = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useForms must be used within a FormProvider')
  }
  return context
}

export const FormProvider: React.FC<FormContextProps> = ({ forms, children }) => {
  return <FormContext.Provider value={{ forms }}>{children}</FormContext.Provider>
}
