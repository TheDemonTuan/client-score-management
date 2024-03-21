import {
  DepartmentCreateParams,
  DepartmentResponse,
  departmentCreate,
  departmentGetAll,
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
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { memo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useShallow } from "zustand/react/shallow";
import { AddSubjectFormValidate, AddSubjectFormValidateSchema } from "./add.validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { SubjectCreateParams, SubjectResponse, subjectCreate } from "@/api/subjects";

const AddSubjectModal = ({ modal_key }: { modal_key: string }) => {
  const queryClient = useQueryClient();

  const { isModalOpen, modalClose } = useModalStore(
    useShallow((state) => ({
      isModalOpen: state.modal_key === modal_key,
      modalClose: state.modalClose,
    }))
  );

  const addSubjectForm = useForm<AddSubjectFormValidate>({
    resolver: zodResolver(AddSubjectFormValidateSchema),
  });

  const { mutate: addMutate, isPending: addIsPending } = useMutation<
    ApiSuccessResponse<SubjectResponse>,
    ApiErrorResponse,
    SubjectCreateParams
  >({
    mutationFn: async (params) => await subjectCreate(params),
    onSuccess: (res) => {
      toast.success("Thêm môn học mới thành công !");
      addSubjectForm.reset();
      modalClose();
      queryClient.setQueryData(["subjects"], (oldData: ApiSuccessResponse<SubjectResponse[]>) =>
        oldData
          ? {
              ...oldData,
              data: [res.data, ...oldData.data],
            }
          : oldData
      );
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Thêm môn học thất bại!");
    },
  });

  const { data: departmentsData, isPending: departmentIsPending } = useQuery<
    ApiSuccessResponse<DepartmentResponse[]>,
    ApiErrorResponse,
    DepartmentResponse[]
  >({
    queryKey: ["departments"],
    queryFn: async () => await departmentGetAll(),
    select: (res) => res?.data,
  });

  const onSubmit = (data: AddSubjectFormValidate) => {
    addMutate({
      name: data?.name,
      credits: parseInt(data?.credits),
      process_percentage: parseInt(data?.process_percentage),
      midterm_percentage: parseInt(data?.midterm_percentage),
      final_percentage: parseInt(data?.final_percentage),
      department_id: parseInt(data?.department_id),
    });
  };

  const handleSubmit = () => {
    addSubjectForm.handleSubmit(onSubmit)();
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
            <ModalHeader>Thêm môn học</ModalHeader>
            <ModalBody>
              <Form {...addSubjectForm}>
                <form method="post" className="space-y-3">
                  <FormField
                    control={addSubjectForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            autoFocus
                            label="Tên"
                            placeholder="Nhập tên môn học"
                            isInvalid={!!addSubjectForm.formState.errors.name}
                            isRequired
                            variant="faded"
                            onClear={() => addSubjectForm.resetField("name")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addSubjectForm.control}
                    name="credits"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            autoFocus
                            label="Tín chỉ"
                            placeholder="Nhập số tín chỉ"
                            isInvalid={!!addSubjectForm.formState.errors.credits}
                            isRequired
                            variant="faded"
                            onClear={() => addSubjectForm.resetField("credits")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addSubjectForm.control}
                    name="process_percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            autoFocus
                            label="Quá trình"
                            placeholder="Nhập % quá trình"
                            isInvalid={!!addSubjectForm.formState.errors.process_percentage}
                            isRequired
                            variant="faded"
                            onClear={() => addSubjectForm.resetField("process_percentage")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addSubjectForm.control}
                    name="midterm_percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            autoFocus
                            label="Giữa kì"
                            placeholder="% giữa kì"
                            isInvalid={!!addSubjectForm.formState.errors.midterm_percentage}
                            isRequired
                            variant="faded"
                            onClear={() => addSubjectForm.resetField("midterm_percentage")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addSubjectForm.control}
                    name="final_percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            autoFocus
                            label="Cuối kì"
                            placeholder="% cuối kì"
                            isInvalid={!!addSubjectForm.formState.errors.final_percentage}
                            isRequired
                            variant="faded"
                            onClear={() => addSubjectForm.resetField("final_percentage")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addSubjectForm.control}
                    name="department_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            isInvalid={!!addSubjectForm.formState.errors.department_id}
                            isRequired
                            variant="faded"
                            isLoading={departmentIsPending}
                            label="Chọn khoa"
                            {...field}
                          >
                            {departmentsData ? (
                              departmentsData.map((department) => (
                                <SelectItem key={department.id} value={department.id}>
                                  {department.name}
                                </SelectItem>
                              ))
                            ) : (
                              <></>
                            )}
                          </Select>
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

export default memo(AddSubjectModal);
