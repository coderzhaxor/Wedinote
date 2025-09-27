import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getTemplateVariables, saveTemplate, saveVariables } from "@/actions/Templates";
import type { TemplateProps, VariableProps } from "@/types/templates";

export function useTemplates() {
  const queryClient = useQueryClient();

  const variablesQuery = useQuery<VariableProps[], Error>({
    queryKey: ["variables"],
    queryFn: async () => {
      const variables = await getTemplateVariables();
      return variables.map(v => ({
        ...v,
        value: v.value === null ? "" : v.value
      }));
    },
  });


  const addTemplateMutation = useMutation<{ templateId: number }[], unknown, TemplateProps>({
    mutationFn: async (template: TemplateProps) => saveTemplate(template),
    onSuccess: (all) => {
      toast.success("Berhasil menambahkan template")
      queryClient.setQueryData(["templates"], all);
    },
    onError: (err) => toast.error(`Error: ${err}`)
  })

  // const saveTemplateVariables = useMutation<VariableProps[], unknown, VariableProps[]>({
  //   mutationFn: async (variables: VariableProps[]) => saveVariables(variables),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["templates"] });
  //   },
  // });

  const addVariableMutation = useMutation({
    mutationFn: async (variable: VariableProps[]) => saveVariables(variable),
    onSuccess: (variable) => {
      const inputCount = variable.length
      toast.success(`Berhasil menyimpan ${inputCount} variable`)
    },
    onError: (err) => toast.error(`Gagal menyimpan: ${err}`)
  })

  return {
    variablesQuery,
    addTemplateMutation,
    addVariableMutation
  };
}
