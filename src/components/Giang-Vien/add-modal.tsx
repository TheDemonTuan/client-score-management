import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/http";
import { useModalStore } from "@/stores/modal-store";
import { Button, Input, Popover, PopoverTrigger, PopoverContent, Select, SelectItem } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AddInstructorFormValidate, AddInstructorFormValidateSchema } from "./add.validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/cn";
import { InstructorCreateParams, InstructorReponse, instructorCreate } from "@/api/instructors";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { DepartmentResponse, departmentGetAll } from "@/api/departments";
import CrudModal from "../crud-modal";

const AddInstructorModal = () => {
  const queryClient = useQueryClient();

  const { modalClose } = useModalStore();

  const addForm = useForm<AddInstructorFormValidate>({
    resolver: zodResolver(AddInstructorFormValidateSchema),
  });

  const { mutate: addMutate, isPending: addIsPending } = useMutation<
    ApiSuccessResponse<InstructorReponse>,
    ApiErrorResponse,
    InstructorCreateParams
  >({
    mutationFn: async (params) => await instructorCreate(params),
    onSuccess: (res) => {
      toast.success("Thêm giảng viên mới thành công !");
      queryClient.setQueryData(["instructors"], (oldData: ApiSuccessResponse<InstructorReponse[]>) =>
        oldData
          ? {
              ...oldData,
              data: [...oldData.data, res.data],
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
                      instructors: [...department.instructors, res.data],
                    }
                  : department
              ),
            }
          : oldData
      );
      modalClose();
      addForm.reset();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Thêm giảng viên thất bại!");
    },
  });

  const { data: departmentsData, isPending: departmentsIsPending } = useQuery<
    ApiSuccessResponse<DepartmentResponse[]>,
    ApiErrorResponse,
    DepartmentResponse[]
  >({
    queryKey: ["departments", { preload: false, select: ["id", "name"] }],
    queryFn: async () =>
      await departmentGetAll({
        preload: false,
        select: ["id", "name"],
      }),
    select: (res) => res?.data,
  });

  const handleSubmit = () => {
    addForm.handleSubmit((data: AddInstructorFormValidate) => {
      addMutate({
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
    })();
  };

  return (
    <CrudModal title="Thêm giảng viên" btnText="Thêm" isPending={addIsPending} handleSubmit={handleSubmit}>
      <Form {...addForm}>
        <form method="post" className="space-y-4">
          <div className="grid grid-flow-col gap-2">
            <FormField
              control={addForm.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      isInvalid={!!addForm.formState.errors.first_name}
                      isRequired
                      placeholder="John"
                      label="Họ"
                      variant="faded"
                      onClear={() => addForm.resetField("first_name")}
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addForm.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      isInvalid={!!addForm.formState.errors.last_name}
                      isRequired
                      placeholder="Wich"
                      label="Tên"
                      variant="faded"
                      onClear={() => addForm.resetField("last_name")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={addForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    isInvalid={!!addForm.formState.errors.email}
                    isRequired
                    placeholder="john.wick@gmail.com"
                    label="Email"
                    variant="faded"
                    onClear={() => addForm.resetField("email")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addForm.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    isInvalid={!!addForm.formState.errors.address}
                    isRequired
                    placeholder="New York"
                    label="Địa chỉ"
                    variant="faded"
                    onClear={() => addForm.resetField("address")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-flow-row lg:grid-flow-col items-center gap-2">
            <FormField
              control={addForm.control}
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
                              !!addForm.formState.errors.birth_day && "border-danger text-danger"
                            )}>
                            {field.value ? field.value.toDateString() : <span>Chọn ngày sinh</span>}
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
              control={addForm.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      isInvalid={!!addForm.formState.errors.gender}
                      isRequired
                      variant="faded"
                      radius="lg"
                      label="Giới tính"
                      placeholder="Chọn giới tính"
                      size="sm"
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
            control={addForm.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    isInvalid={!!addForm.formState.errors.phone}
                    isRequired
                    placeholder="0123456789"
                    label="Số điện thoại"
                    variant="faded"
                    onClear={() => addForm.resetField("phone")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addForm.control}
            name="degree"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    isInvalid={!!addForm.formState.errors.degree}
                    isRequired
                    placeholder="Master"
                    label="Bằng cấp"
                    variant="faded"
                    onClear={() => addForm.resetField("degree")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addForm.control}
            name="department_id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    isInvalid={!!addForm.formState.errors.department_id}
                    isRequired
                    variant="faded"
                    isLoading={departmentsIsPending}
                    isDisabled={departmentsIsPending}
                    disabledKeys={[field.value]}
                    label="Chọn khoa"
                    items={departmentsData ?? []}
                    {...field}>
                    {(item) => (
                      <SelectItem key={item.id} className="capitalize">
                        {item.name}
                      </SelectItem>
                    )}
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

export default AddInstructorModal;
