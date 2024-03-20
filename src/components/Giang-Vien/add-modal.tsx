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
  Popover,
  PopoverTrigger,
  PopoverContent,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { memo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useShallow } from "zustand/react/shallow";
import { AddInstructorFormValidate, AddInstructorFormValidateSchema } from "./add.validate";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/cn";
import { InstructorCreateParams, InstructorReponse, instructorCreate } from "@/api/instructors";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DepartmentResponse, departmentGetList } from "@/api/departments";

const AddInstructorModal = ({ modal_key }: { modal_key: string }) => {
  const queryClient = useQueryClient();

  const { isModalOpen, modalClose } = useModalStore(
    useShallow((state) => ({
      isModalOpen: state.modal_key === modal_key,
      modalClose: state.modalClose,
    }))
  );

  const addInstructorForm = useForm<AddInstructorFormValidate>({
    resolver: zodResolver(AddInstructorFormValidateSchema),
  });

  const { mutateAsync: addMutateAsync, isPending: addIsPending } = useMutation<
    ApiSuccessResponse<InstructorReponse>,
    ApiErrorResponse,
    InstructorCreateParams
  >({
    mutationFn: async (params) => await instructorCreate(params),
    onSuccess: (res) => {
      toast.success("Thêm giảng viên mới thành công !");
      queryClient.setQueryData(
        ["instructors"],
        (oldData: ApiSuccessResponse<InstructorReponse[]>) =>
          oldData
            ? {
                ...oldData,
                data: [...oldData.data, res.data],
              }
            : oldData
      );
      queryClient.setQueryData(
        ["departments"],
        (oldData: ApiSuccessResponse<DepartmentResponse[]>) =>
          oldData
            ? {
                ...oldData,
                data: oldData.data.map((department) =>
                  department.id === res.data.department_id
                    ? {
                        ...department,
                        instructors: [...department.instructors, res.data],
                      }
                    : department
                ),
              }
            : oldData
      );
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Thêm giảng viên thất bại!");
    },
  });

  const { data: departmentsData, isPending: departmentIsPending } = useQuery<
    ApiSuccessResponse<DepartmentResponse[]>,
    ApiErrorResponse,
    DepartmentResponse[]
  >({
    queryKey: ["departments"],
    queryFn: async () => await departmentGetList(),
    select: (res) => res?.data,
  });

  const onSubmit = async (data: AddInstructorFormValidate) => {
    await addMutateAsync({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      address: data.address,
      birth_day: data.birth_day,
      degree: data.degree,
      phone: data.phone,
      gender: data.gender === "nu",
      department_id: parseInt(data.department_id),
    });
    modalClose();
    addInstructorForm.reset();
  };

  const handleSubmit = () => {
    addInstructorForm.handleSubmit(onSubmit)();
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onOpenChange={modalClose}
      scrollBehavior="inside"
      placement="top-center"
      className={cn(addIsPending && "pointer-events-none")}
      size="lg"
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Thêm giảng viên</ModalHeader>
            <ModalBody>
              <Form {...addInstructorForm}>
                <form method="post" className="space-y-4">
                  <div className="grid grid-flow-col gap-2">
                    <FormField
                      control={addInstructorForm.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              isInvalid={!!addInstructorForm.formState.errors.first_name}
                              isRequired
                              placeholder="John"
                              label="Họ"
                              variant="faded"
                              onClear={() => addInstructorForm.resetField("first_name")}
                              {...field}
                              autoFocus
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addInstructorForm.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              isInvalid={!!addInstructorForm.formState.errors.last_name}
                              isRequired
                              placeholder="Wich"
                              label="Tên"
                              variant="faded"
                              onClear={() => addInstructorForm.resetField("last_name")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={addInstructorForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            isInvalid={!!addInstructorForm.formState.errors.email}
                            isRequired
                            placeholder="john.wick@gmail.com"
                            label="Email"
                            variant="faded"
                            onClear={() => addInstructorForm.resetField("email")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addInstructorForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            isInvalid={!!addInstructorForm.formState.errors.address}
                            isRequired
                            placeholder="New York"
                            label="Địa chỉ"
                            variant="faded"
                            onClear={() => addInstructorForm.resetField("address")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-flow-col items-center gap-2">
                    <FormField
                      control={addInstructorForm.control}
                      name="birth_day"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormControl>
                            <Popover>
                              <PopoverTrigger>
                                <FormControl>
                                  <Button
                                    size="lg"
                                    about="Chọn ngày sinh"
                                    variant="faded"
                                    className={cn(
                                      "pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                      !!addInstructorForm.formState.errors.birth_day &&
                                        "border-danger text-danger"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Chọn ngày sinh</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addInstructorForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              isInvalid={!!addInstructorForm.formState.errors.gender}
                              isRequired
                              variant="faded"
                              radius="lg"
                              label="Giới tính"
                              placeholder="Chọn giới tính"
                              size="sm"
                              {...field}
                            >
                              <SelectItem key="nam" value="nam">
                                Nam
                              </SelectItem>
                              <SelectItem key="nu" value="nu">
                                Nữ
                              </SelectItem>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={addInstructorForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            isInvalid={!!addInstructorForm.formState.errors.phone}
                            isRequired
                            placeholder="0123456789"
                            label="Số điện thoại"
                            variant="faded"
                            onClear={() => addInstructorForm.resetField("phone")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addInstructorForm.control}
                    name="degree"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            isInvalid={!!addInstructorForm.formState.errors.degree}
                            isRequired
                            placeholder="Master"
                            label="Bằng cấp"
                            variant="faded"
                            onClear={() => addInstructorForm.resetField("degree")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addInstructorForm.control}
                    name="department_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            isInvalid={!!addInstructorForm.formState.errors.department_id}
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

export default memo(AddInstructorModal);
