import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/http";
import { useModalStore } from "@/stores/modal-store";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useShallow } from "zustand/react/shallow";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { EditSubjectFormValidate, EditSubjectFormValidateSchema } from "./edit.validate";
import CrudModal from "../crud-modal";
import { SubjectResponse, SubjectUpdateByIdParams, subjectUpdateById } from "@/api/subjects";
import { DepartmentResponse, departmentGetById } from "@/api/departments";

const EditSubjectModal = () => {
  const queryClient = useQueryClient();

  const { modalClose, modalData } = useModalStore(
    useShallow((state) => ({
      modalClose: state.modalClose,
      modalData: state.modalData as SubjectResponse,
    }))
  );

  const editForm = useForm<EditSubjectFormValidate>({
    resolver: zodResolver(EditSubjectFormValidateSchema),
    values: {
      name: modalData?.name || "",
      credits: modalData?.credits + "",
      process_percentage: modalData?.process_percentage + "",
      midterm_percentage: modalData?.midterm_percentage + "",
      final_percentage: modalData?.final_percentage + "",
      department_id: modalData?.department_id + "",
    },
  });

  const { data: departmentData, isPending: departmentIsPending } = useQuery<
    ApiSuccessResponse<DepartmentResponse>,
    ApiErrorResponse,
    DepartmentResponse
  >({
    queryKey: ["departments", { id: modalData?.department_id, preload: false, select: ["id", "name"] }],
    queryFn: async () =>
      await departmentGetById({
        id: modalData?.department_id,
        preload: false,
        select: ["name"],
      }),
    select: (res) => res?.data,
  });

  const { mutate: editMutate, isPending: editIsPending } = useMutation<
    ApiSuccessResponse<SubjectResponse>,
    ApiErrorResponse,
    SubjectUpdateByIdParams
  >({
    mutationFn: async (params) => await subjectUpdateById(params),
    onSuccess: (res) => {
      toast.success("Cập nhật môn học thành công !");
      queryClient.setQueryData(["subjects"], (oldData: ApiSuccessResponse<SubjectResponse[]>) =>
        oldData
          ? {
              ...oldData,
              data: oldData.data.map((item) => (item.id === res.data.id ? res.data : item)),
            }
          : oldData
      );
      modalClose();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Cập nhật khoa thất bại!");
    },
  });

  const handleSubmit = () => {
    editForm.handleSubmit((data: EditSubjectFormValidate) => {
      editMutate({
        id: modalData?.id,
        name: data?.name,
        credits: parseInt(data?.credits),
        process_percentage: parseInt(data?.process_percentage),
        midterm_percentage: parseInt(data?.midterm_percentage),
        final_percentage: parseInt(data?.final_percentage),
      });
    })();
  };

  return (
    <CrudModal title="Sửa môn học" btnText="Cập nhật" isPending={editIsPending} handleSubmit={handleSubmit}>
      <Form {...editForm}>
        <form method="post" className="space-y-3">
          <FormField
            control={editForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoFocus
                    label="Tên"
                    placeholder={modalData?.name}
                    isInvalid={!!editForm.formState.errors.name}
                    isRequired
                    variant="faded"
                    onClear={() => editForm.setValue("name", "")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editForm.control}
            name="credits"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoFocus
                    label="Tín chỉ"
                    placeholder={modalData?.credits + ""}
                    isInvalid={!!editForm.formState.errors.credits}
                    isRequired
                    variant="faded"
                    onClear={() => editForm.setValue("credits", "")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editForm.control}
            name="process_percentage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoFocus
                    label="Quá trình"
                    placeholder={modalData?.process_percentage + ""}
                    isInvalid={!!editForm.formState.errors.process_percentage}
                    isRequired
                    variant="faded"
                    onClear={() => editForm.setValue("process_percentage", "")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editForm.control}
            name="midterm_percentage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoFocus
                    label="Giữa kì"
                    placeholder={modalData?.midterm_percentage + ""}
                    isInvalid={!!editForm.formState.errors.midterm_percentage}
                    isRequired
                    variant="faded"
                    onClear={() => editForm.setValue("midterm_percentage", "")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editForm.control}
            name="final_percentage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoFocus
                    label="Cuối kì"
                    placeholder={modalData?.final_percentage + ""}
                    isInvalid={!!editForm.formState.errors.final_percentage}
                    isRequired
                    variant="faded"
                    onClear={() => editForm.setValue("final_percentage", "")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editForm.control}
            name="department_id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    isInvalid={!!editForm.formState.errors.department_id}
                    isRequired
                    variant="faded"
                    isLoading={departmentIsPending}
                    defaultSelectedKeys={[field.value]}
                    selectedKeys={[field.value]}
                    disabledKeys={[field.value]}
                    label="Khoa"
                    {...field}>
                    <SelectItem key={modalData?.department_id} className="capitalize">
                      {departmentData?.name}
                    </SelectItem>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </CrudModal>
  );
};

export default EditSubjectModal;
