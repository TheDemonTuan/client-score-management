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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { cn } from "@/lib/cn";
import RequestLoadingText from "../request-loading-text";

const AddDepartmentModal = ({ modal_key }: { modal_key: string }) => {
  const queryClient = useQueryClient();

  const { isOpen, onOpenChange } = useModalStore(
    useShallow((state) => ({
      isOpen: state.key === modal_key,
      onOpenChange: state.onOpenChange,
    }))
  );

  const addDepartmentForm = useForm<AddDepartmentFormValidate>({
    resolver: zodResolver(AddDepartmentFormValidateSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutateAsync: addMutateAsync, isPending: addIsPending } = useMutation<
    ApiSuccessResponse<DepartmentResponse>,
    ApiErrorResponse,
    DepartmentCreateParams
  >({
    mutationFn: async (params) => await departmentCreate(params),
    onSuccess: (res) => {
      toast.success("Thêm khoa mới thành công !");
      queryClient.setQueryData(
        ["departments"],
        (oldData: ApiSuccessResponse<DepartmentResponse[]> | undefined) => {
          if (oldData) {
            return {
              data: [res.data, ...oldData.data],
            };
          }
        }
      );
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Thêm khoa thất bại!");
    },
  });

  const onSubmit = async (data: AddDepartmentFormValidate) => {
    await addMutateAsync({
      name: data?.name,
    });
    onOpenChange(false);
    addDepartmentForm.reset();
  };

  const handleSubmit = () => {
    addDepartmentForm.handleSubmit(onSubmit)();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      className={cn(addIsPending && "pointer-events-none")}
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Thêm khoa</ModalHeader>
            <ModalBody>
              <Form {...addDepartmentForm}>
                <form method="post" className="space-y-3">
                  <FormField
                    control={addDepartmentForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên</FormLabel>
                        <FormControl>
                          <Input
                            autoFocus
                            endContent={
                              <MdDriveFileRenameOutline
                                size={28}
                                className="text-2xl pointer-events-none flex-shrink-0"
                              />
                            }
                            label="Tên"
                            placeholder="Nhập tên khoa"
                            variant="bordered"
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
              <Button color="danger" variant="flat" onPress={onClose} isDisabled={addIsPending}>
                Đóng
              </Button>
              <Button onClick={handleSubmit} color="secondary" isDisabled={addIsPending}>
                <RequestLoadingText text="Thêm" isLoading={addIsPending} />
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default memo(AddDepartmentModal);
