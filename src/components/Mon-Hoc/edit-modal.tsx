import {
  DepartmentResponse,
  DepartmentUpdateByIdParams,
  departmentUpdateById,
} from "@/api/departments";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { EditDepartmentFormValidate, EditDepartmentFormValidateSchema } from "./edit.validate";

const EditDepartmentModal = ({ modal_key }: { modal_key: string }) => {
  const queryClient = useQueryClient();

  const { isModalOpen, modalClose, modalData } = useModalStore(
    useShallow((state) => ({
      isModalOpen: state.modal_key === modal_key,
      modalClose: state.modalClose,
      modalData: state.modalData as DepartmentResponse,
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
      queryClient.setQueryData(
        ["departments"],
        (oldData: ApiSuccessResponse<DepartmentResponse[]>) =>
          oldData
            ? {
                ...oldData,
                data: oldData.data.map((item) => (item.id === res.data.id ? res.data : item)),
              }
            : oldData
      );
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Cập nhật khoa thất bại!");
    },
    onSettled: () => {
      modalClose();
    },
  });

  const onSubmit = (data: EditDepartmentFormValidate) => {
    editMutate({
      id: modalData?.id,
      name: data.name,
    });
  };

  const handleSubmit = () => {
    editDepartmentForm.handleSubmit(onSubmit)();
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onOpenChange={modalClose}
      placement="center"
      scrollBehavior="inside"
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Sửa khoa</ModalHeader>
            <ModalBody>
              <Form {...editDepartmentForm}>
                <form method="post" className="space-y-3">
                  <FormField
                    control={editDepartmentForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel>Tên</FormLabel> */}
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
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose} isLoading={editIsPending}>
                Đóng
              </Button>
              <Button onClick={handleSubmit} color="secondary" isLoading={editIsPending}>
                Cập nhật
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default memo(EditDepartmentModal) as typeof EditDepartmentModal;
