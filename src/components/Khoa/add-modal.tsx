import { DepartmentCreateParams, DepartmentResponse, departmentCreate } from "@/api/departments";
import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/http";
import { useModalStore } from "@/stores/modal-store";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useShallow } from "zustand/react/shallow";
import { AddDepartmentFormValidate, AddDepartmentFormValidateSchema } from "./add.validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const AddDepartmentModal = ({ modal_key }: { modal_key: string }) => {
  const queryClient = useQueryClient();

  const { isModalOpen, modalClose } = useModalStore(
    useShallow((state) => ({
      isModalOpen: state.modal_key === modal_key,
      modalClose: state.modalClose,
    }))
  );

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
      addDepartmentForm.reset();
      modalClose();
      queryClient.setQueryData(
        ["departments"],
        (oldData: ApiSuccessResponse<DepartmentResponse[]>) =>
          oldData
            ? {
                ...oldData,
                data: [res.data, ...oldData.data],
              }
            : oldData
      );
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Thêm khoa thất bại!");
    },
  });

  const onSubmit = (data: AddDepartmentFormValidate) => {
    addMutate({
      name: data?.name,
    });
  };

  const handleSubmit = () => {
    addDepartmentForm.handleSubmit(onSubmit)();
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onOpenChange={modalClose}
      scrollBehavior="inside"
      placement="center"
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Thêm khoa</ModalHeader>
            <ModalBody>
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
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose} isLoading={addIsPending}>
                Đóng
              </Button>
              <Button onClick={handleSubmit} color="secondary" isLoading={addIsPending}>
                Thêm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default memo(AddDepartmentModal);
