import { DepartmentCreateParams, DepartmentResponse, departmentCreate } from "@/api/departments";
import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/http";
import { useModalStore } from "@/stores/modal-store";
import { Input } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AddDepartmentFormValidate, AddDepartmentFormValidateSchema } from "./add.validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import CrudModal from "../crud-modal";

const AddDepartmentModal = () => {
  const queryClient = useQueryClient();

  const { modalClose } = useModalStore();

  const addDepartmentForm = useForm<AddDepartmentFormValidate>({
    resolver: zodResolver(AddDepartmentFormValidateSchema),
  });

  const { mutate: addMutate, isPending: addIsPending } = useMutation<
    ApiSuccessResponse<DepartmentResponse>,
    ApiErrorResponse,
    DepartmentCreateParams
  >({
    mutationFn: async (params) => await departmentCreate(params),
    onSuccess: (res) => {
      toast.success("Thêm khoa mới thành công !");
      queryClient.setQueryData(["departments"], (oldData: ApiSuccessResponse<DepartmentResponse[]>) =>
        oldData
          ? {
              ...oldData,
              data: [res.data, ...oldData.data],
            }
          : oldData
      );
      addDepartmentForm.reset();
      modalClose();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Thêm khoa thất bại!");
    },
  });

  const handleSubmit = () => {
    addDepartmentForm.handleSubmit((data: AddDepartmentFormValidate) => {
      addMutate({
        name: data.name,
      });
    })();
  };

  return (
    <CrudModal title="Thêm khoa" btnText="Thêm" isPending={addIsPending} handleSubmit={handleSubmit}>
      <Form {...addDepartmentForm}>
        <form method="post" className="space-y-3">
          <FormField
            control={addDepartmentForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoFocus
                    label="Tên"
                    placeholder="Nhập tên khoa"
                    isInvalid={!!addDepartmentForm.formState.errors.name}
                    isRequired
                    variant="faded"
                    onClear={() => addDepartmentForm.resetField("name")}
                    {...field}
                  />
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

export default AddDepartmentModal;
