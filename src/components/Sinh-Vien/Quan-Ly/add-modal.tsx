import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/http";
import { useModalStore } from "@/stores/modal-store";
import { Button, Input, Popover, PopoverTrigger, PopoverContent, Select, SelectItem } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AddStudentFormValidate, AddStudentFormValidateSchema } from "./add.validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/cn";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { DepartmentResponse, departmentGetAll } from "@/api/departments";
import CrudModal from "../../crud-modal";
import { StudentCreateParams, StudentResponse, studentCreate } from "@/api/students";

const currentYear = new Date().getFullYear();
const lastTwoDigits = currentYear % 100;
const AddStudentModal = () => {
  const queryClient = useQueryClient();

  const { modalClose } = useModalStore();

  const addForm = useForm<AddStudentFormValidate>({
    resolver: zodResolver(AddStudentFormValidateSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      address: "",
      phone: "",
    },
  });

  const { mutate: addMutate, isPending: addIsPending } = useMutation<
    ApiSuccessResponse<StudentResponse>,
    ApiErrorResponse,
    StudentCreateParams
  >({
    mutationFn: async (params) => await studentCreate(params),
    onSuccess: (res) => {
      toast.success("Thêm sinh viên mới thành công !");
      queryClient.setQueryData(["students"], (oldData: ApiSuccessResponse<StudentResponse[]>) =>
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
                      students: [...department.students, res.data],
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
      toast.error(error?.response?.data?.message || "Thêm sinh viên thất bại!");
    },
  });

  const { data: departmentsData, isPending: departmentsIsPending } = useQuery<
    ApiSuccessResponse<DepartmentResponse[]>,
    ApiErrorResponse,
    DepartmentResponse[]
  >({
    queryKey: ["departments"],
    queryFn: async () => await departmentGetAll(),
    select: (res) => res?.data,
  });

  const handleSubmit = () => {
    addForm.handleSubmit((data: AddStudentFormValidate) => {
      addMutate({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        address: data.address,
        birth_day: data.birth_day,
        phone: data.phone,
        gender: data.gender === "nu",
        academic_year: parseInt(data.academic_year) % 100,
        department_id: parseInt(data.department_id),
      });
    })();
  };

  return (
    <CrudModal title="Thêm sinh viên" btnText="Thêm" isPending={addIsPending} handleSubmit={handleSubmit}>
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
            name="academic_year"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    isInvalid={!!addForm.formState.errors.academic_year}
                    isRequired
                    variant="faded"
                    disabledKeys={[field.value]}
                    label="Chọn khoá học"
                    onChange={field.onChange}
                    selectedKeys={[field.value]}>
                    {[...Array(lastTwoDigits)].map((_, index) => {
                      const year = 2000 + index + 1;
                      return <SelectItem key={year}>{year + ""}</SelectItem>;
                    })}
                  </Select>
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
                    selectedKeys={[field.value]}
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

export default AddStudentModal;
