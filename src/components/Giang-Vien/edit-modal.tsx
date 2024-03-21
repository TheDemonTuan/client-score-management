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
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/cn";
import { EditInstructorFormValidate, EditInstructorFormValidateSchema } from "./edit.validate";
import {
  InstructorReponse,
  InstructorUpdateByIdParams,
  instructorUpdateById,
} from "@/api/instructors";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DepartmentResponse, departmentGetAll } from "@/api/departments";

const EditInstructorModal = ({ modal_key }: { modal_key: string }) => {
  const queryClient = useQueryClient();

  const { isModalOpen, modalClose, modalData } = useModalStore(
    useShallow((state) => ({
      isModalOpen: state.modal_key === modal_key,
      modalClose: state.modalClose,
      modalData: state.modalData as InstructorReponse,
    }))
  );

  const editInstructorForm = useForm<EditInstructorFormValidate>({
    resolver: zodResolver(EditInstructorFormValidateSchema),
    values: {
      first_name: modalData?.first_name,
      last_name: modalData?.last_name,
      email: modalData?.email,
      address: modalData?.address,
      birth_day: modalData?.birth_day,
      degree: modalData?.degree,
      phone: modalData?.phone,
      gender: modalData?.gender === true ? "nu" : "nam",
      department_id: modalData?.department_id + "",
    },
  });

  const { mutate: editMutate, isPending: editIsPending } = useMutation<
    ApiSuccessResponse<InstructorReponse>,
    ApiErrorResponse,
    InstructorUpdateByIdParams
  >({
    mutationFn: async (params) => await instructorUpdateById(params),
    onSuccess: (res) => {
      toast.success("Cập nhật giảng viên thành công !");
      modalClose();
      queryClient.setQueryData(
        ["instructors"],
        (oldData: ApiSuccessResponse<InstructorReponse[]>) =>
          oldData
            ? {
                ...oldData,
                data: oldData.data.map((item) => (item.id === res.data.id ? res.data : item)),
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
                        instructors: department.instructors.map((instructor) =>
                          instructor.id === res.data.id ? res.data : instructor
                        ),
                      }
                    : department
                ),
              }
            : oldData
      );
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Cập nhật giảng viên thất bại!");
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

  const onSubmit = (data: EditInstructorFormValidate) => {
    editMutate({
      id: modalData?.id,
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
  };

  const handleSubmit = () => {
    editInstructorForm.handleSubmit(onSubmit)();
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onOpenChange={modalClose}
      placement="center"
      scrollBehavior="inside"
      size="lg"
      className={cn(editIsPending && "pointer-events-none")}
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Sửa giảng viên</ModalHeader>
            <ModalBody>
              <Form {...editInstructorForm}>
                <form method="post" className="space-y-4">
                  <div className="grid grid-flow-col gap-2">
                    <FormField
                      control={editInstructorForm.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              isInvalid={!!editInstructorForm.formState.errors.first_name}
                              isRequired
                              placeholder={modalData?.first_name || ""}
                              label="Họ"
                              variant="faded"
                              onClear={() => editInstructorForm.setValue("first_name", "")}
                              {...field}
                              autoFocus
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editInstructorForm.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              isInvalid={!!editInstructorForm.formState.errors.last_name}
                              isRequired
                              placeholder={modalData?.last_name || ""}
                              label="Tên"
                              variant="faded"
                              onClear={() => editInstructorForm.setValue("last_name", "")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={editInstructorForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            isInvalid={!!editInstructorForm.formState.errors.email}
                            isRequired
                            placeholder={modalData?.email || ""}
                            label="Email"
                            variant="faded"
                            onClear={() => editInstructorForm.setValue("email", "")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editInstructorForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            isInvalid={!!editInstructorForm.formState.errors.address}
                            isRequired
                            placeholder={modalData?.address || ""}
                            label="Địa chỉ"
                            variant="faded"
                            onClear={() => editInstructorForm.setValue("address", "")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-flow-row lg:grid-flow-col items-center gap-2">
                    <FormField
                      control={editInstructorForm.control}
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
                                      !!editInstructorForm.formState.errors.birth_day &&
                                        "border-danger text-danger"
                                    )}
                                  >
                                    {field.value ? (
                                      <span>
                                        {format(field.value ?? modalData.birth_day, "PPP")}
                                      </span>
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
                      control={editInstructorForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              isInvalid={!!editInstructorForm.formState.errors.gender}
                              isRequired
                              variant="faded"
                              radius="lg"
                              label="Giới tính"
                              placeholder="Chọn giới tính"
                              size="sm"
                              defaultSelectedKeys={[modalData?.gender === true ? "nu" : "nam"]}
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
                    control={editInstructorForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            isInvalid={!!editInstructorForm.formState.errors.phone}
                            isRequired
                            placeholder={modalData?.phone || ""}
                            label="Số điện thoại"
                            variant="faded"
                            onClear={() => editInstructorForm.setValue("phone", "")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editInstructorForm.control}
                    name="degree"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            isInvalid={!!editInstructorForm.formState.errors.degree}
                            isRequired
                            placeholder={modalData?.degree || ""}
                            label="Bằng cấp"
                            variant="faded"
                            onClear={() => editInstructorForm.setValue("degree", "")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editInstructorForm.control}
                    name="department_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            isInvalid={!!editInstructorForm.formState.errors.department_id}
                            isRequired
                            variant="faded"
                            isLoading={departmentIsPending}
                            label="Chọn khoa"
                            defaultSelectedKeys={[modalData?.department_id + ""]}
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

export default memo(EditInstructorModal) as typeof EditInstructorModal;
