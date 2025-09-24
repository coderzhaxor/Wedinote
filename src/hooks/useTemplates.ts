import { saveTemplate } from "@/actions/Templates";
import { TemplateProps } from "@/types/templates";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useTemplates() {
  const queryClient = useQueryClient();

  const addTemplateMutation = useMutation<{ templateId: number }[], unknown, TemplateProps>({
    mutationFn: async (template: TemplateProps) => saveTemplate(template),
    onSuccess: (all) => {
      toast.success("Berhasil menambahkan template")
      queryClient.setQueryData(["contacts"], all);
    },
    onError: (err) => toast.error(`Error: ${err}`)
  })

  // const saveTemplateVariables = useMutation<VariableProps[], unknown, VariableProps[]>({
  //   mutationFn: async (variables: VariableProps[]) => saveVariables(variables),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["templates"] });
  //   },
  // });

  return { addTemplateMutation };
}
