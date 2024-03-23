import { DepartmentResponse, DepartmentUpdateByIdParams, departmentUpdateById } from "@/api/departments";
import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/http";
import { useModalStore } from "@/stores/modal-store";
import { Input } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { EditDepartmentFormValidate, EditDepartmentFormValidateSchema } from "./edit.validate";
import CRUDModal from "../crud-modal";
import { useShallow } from "zustand/react/shallow";

const EditDepartmentModal = () => {
  const queryClient = useQueryClient();

  const { modalClose, modalData } = useModalStore(
    useShallow((state) => ({
      modalData: state.modalData as DepartmentResponse,
      modalClose: state.modalClose,
    }))
  );

  const editDepartmentForm = useForm<EditDepartmentFormValidate>({
    resolver: zodResolver(EditDepartmentFormValidateSchema),
    values: {
      name: modalData?.name || "",
    },
  });

  const { mutate: editMutate, isPending: editIsPending } = useMutation<
    ApiSuccessResponse<DepartmentResponse>,
    ApiErrorResponse,
    DepartmentUpdateByIdParams
  >({
    mutationFn: async (params) => await departmentUpdateById(params),
    onSuccess: (res) => {
      toast.success("Cập nhật khoa thành công !");
      queryClient.setQueryData(["departments"], (oldData: ApiSuccessResponse<DepartmentResponse[]>) =>
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
    editDepartmentForm.handleSubmit((data: EditDepartmentFormValidate) => {
      editMutate({
        id: modalData?.id,
        name: data.name,
      });
    })();
  };

  return (
    <CRUDModal title="Chỉnh sửa khoa" btnText="Cập nhật" isPending={editIsPending} handleSubmit={handleSubmit}>
      <Form {...editDepartmentForm}>
        <form method="post" className="space-y-3">
          <FormField
            control={editDepartmentForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoFocus
                    label="Tên"
                    placeholder={modalData?.name || "Tên khoa"}
                    isInvalid={!!editDepartmentForm.formState.errors.name}
                    isRequired
                    variant="faded"
                    onClear={() => editDepartmentForm.setValue("name", "")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </CRUDModal>
  );
};

export default EditDepartmentModal;
