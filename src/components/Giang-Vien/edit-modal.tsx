import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/http";
import { useModalStore } from "@/stores/modal-store";
import { Button, Input, Popover, PopoverTrigger, PopoverContent, Select, SelectItem } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useShallow } from "zustand/react/shallow";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/cn";
import { EditInstructorFormValidate, EditInstructorFormValidateSchema } from "./edit.validate";
import { InstructorReponse, InstructorUpdateByIdParams, instructorUpdateById } from "@/api/instructors";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { DepartmentResponse, departmentGetById } from "@/api/departments";
import CrudModal from "../crud-modal";

const modal_key = "edit_instructor";

const EditInstructorModal = () => {
  const queryClient = useQueryClient();

  const { modalClose, modalData } = useModalStore(
    useShallow((state) => ({
      modalClose: state.modalClose,
      modalData: state.modalData as InstructorReponse,
    }))
  );

  const editForm = useForm<EditInstructorFormValidate>({
    resolver: zodResolver(EditInstructorFormValidateSchema),
    values: {
      first_name: modalData?.first_name,
      last_name: modalData?.last_name,
      email: modalData?.email,
      address: modalData?.address,
      birth_day: modalData?.birth_day,
      degree: modalData?.degree,
      phone: modalData?.phone,
      gender: modalData.gender ? "nu" : "nam",
      department_id: modalData.department_id + "",
    },
  });

  useEffect(() => {
    editForm.setValue("birth_day", new Date(modalData.birth_day));
  }, [editForm, modalData]);

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
    ApiSuccessResponse<InstructorReponse>,
    ApiErrorResponse,
    InstructorUpdateByIdParams
  >({
    mutationFn: async (params) => await instructorUpdateById(params),
    onSuccess: (res) => {
      toast.success("Cập nhật giảng viên thành công !");
      queryClient.setQueryData(["instructors"], (oldData: ApiSuccessResponse<InstructorReponse[]>) =>
        oldData
          ? {
              ...oldData,
              data: oldData.data.map((item) => (item.id === res.data.id ? res.data : item)),
            }
          : oldData
      );

      queryClient.setQueryData(["departments"], (oldData: ApiSuccessResponse<DepartmentResponse[]>) =>
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
      modalClose();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Cập nhật giảng viên thất bại!");
    },
  });

  const handleSubmit = () => {
    editForm.handleSubmit((data: EditInstructorFormValidate) => {
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
      });
    })();
  };

  return (
    <CrudModal title="Chỉnh sửa giảng viên" btnText="Cập nhật" isPending={editIsPending} handleSubmit={handleSubmit}>
      <Form {...editForm}>
        <form method="post" className="space-y-4">
          <div className="grid grid-flow-col gap-2">
            <FormField
              control={editForm.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      isInvalid={!!editForm.formState.errors.first_name}
                      isRequired
                      placeholder={modalData?.first_name}
                      label="Họ"
                      variant="faded"
                      onClear={() => editForm.setValue("first_name", "")}
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editForm.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      isInvalid={!!editForm.formState.errors.last_name}
                      isRequired
                      placeholder={modalData?.last_name}
                      label="Tên"
                      variant="faded"
                      onClear={() => editForm.setValue("last_name", "")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={editForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    isInvalid={!!editForm.formState.errors.email}
                    isRequired
                    placeholder={modalData?.email}
                    label="Email"
                    variant="faded"
                    onClear={() => editForm.setValue("email", "")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editForm.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    isInvalid={!!editForm.formState.errors.address}
                    isRequired
                    placeholder={modalData?.address}
                    label="Địa chỉ"
                    variant="faded"
                    onClear={() => editForm.setValue("address", "")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-flow-row lg:grid-flow-col items-center gap-2">
            <FormField
              control={editForm.control}
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
                              !!editForm.formState.errors.birth_day && "border-danger text-danger"
                            )}>
                            {field.value ? (
                              <span>{new Date(field.value).toDateString()}</span>
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
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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
              control={editForm.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      isInvalid={!!editForm.formState.errors.gender}
                      isRequired
                      variant="faded"
                      radius="lg"
                      label="Giới tính"
                      placeholder="Chọn giới tính"
                      size="sm"
                      defaultSelectedKeys={[modalData?.gender ? "nu" : "nam"]}
                      {...field}>
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
            control={editForm.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    isInvalid={!!editForm.formState.errors.phone}
                    isRequired
                    placeholder={modalData?.phone}
                    label="Số điện thoại"
                    variant="faded"
                    onClear={() => editForm.setValue("phone", "")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editForm.control}
            name="degree"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    isInvalid={!!editForm.formState.errors.degree}
                    isRequired
                    placeholder={modalData?.degree}
                    label="Bằng cấp"
                    variant="faded"
                    onClear={() => editForm.setValue("degree", "")}
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

export default EditInstructorModal;
