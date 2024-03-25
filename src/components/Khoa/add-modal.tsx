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

  const addForm = useForm<AddDepartmentFormValidate>({
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
      addForm.reset();
      modalClose();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Thêm khoa thất bại!");
    },
  });

  const handleSubmit = () => {
    addForm.handleSubmit((data: AddDepartmentFormValidate) => {
      addMutate({
        id: data.id,
        symbol: data.symbol,
        name: data.name,
      });
    })();
  };

  return (
    <CrudModal title="Thêm khoa" btnText="Thêm" isPending={addIsPending} handleSubmit={handleSubmit}>
      <Form {...addForm}>
        <form method="post" className="space-y-3">
          <FormField
            control={addForm.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    label="Mã"
                    placeholder="Nhập mã khoa"
                    isInvalid={!!addForm.formState.errors.id}
                    isRequired
                    variant="faded"
                    type="number"
                    onClear={() => addForm.setValue("id", 0)}
                    {...field}
                    value={addForm.getValues("id") + ""}
                    onChange={(e) => {
                      addForm.setValue("id", parseInt(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addForm.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    label="Ký hiệu"
                    placeholder="Nhập ký hiệu khoa"
                    isInvalid={!!addForm.formState.errors.symbol}
                    isRequired
                    variant="faded"
                    onClear={() => addForm.setValue("symbol", "")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    label="Tên"
                    placeholder="Nhập tên khoa"
                    isInvalid={!!addForm.formState.errors.name}
                    isRequired
                    variant="faded"
                    onClear={() => addForm.resetField("name")}
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
