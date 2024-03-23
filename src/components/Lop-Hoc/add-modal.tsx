import { DepartmentResponse, departmentGetAll } from "@/api/departments";
import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/http";
import { useModalStore } from "@/stores/modal-store";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AddClassFormValidate, AddClassFormValidateSchema } from "./add.validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import CrudModal from "../crud-modal";
import { ClassCreateParams, ClassResponse, classCreate } from "@/api/classes";
import { InstructorReponse, instructorGetAllByDepartmentId } from "@/api/instructors";
import { useEffect } from "react";

const AddClassModal = () => {
  const queryClient = useQueryClient();

  const { modalClose } = useModalStore();

  const addForm = useForm<AddClassFormValidate>({
    resolver: zodResolver(AddClassFormValidateSchema),
  });

  const departmentId = addForm.watch("department_id");

  useEffect(() => {
    addForm.setValue("host_instructor_id", "");
  }, [addForm, departmentId]);

  useEffect(() => {
    return () => {
      // console.log("run");
      queryClient.removeQueries({
        queryKey: [
          "instructors",
          "department",
          {
            id: "NaN",
            preload: false,
            select: ["id", "first_name", "last_name"],
          },
        ],
      });
    };
  }, []);

  const { mutate: addMutate, isPending: addIsPending } = useMutation<
    ApiSuccessResponse<ClassResponse>,
    ApiErrorResponse,
    ClassCreateParams
  >({
    mutationFn: async (params) => await classCreate(params),
    onSuccess: (res) => {
      toast.success("Thêm lớp mới thành công !");
      queryClient.setQueryData(["classes"], (oldData: ApiSuccessResponse<ClassResponse[]>) =>
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
      toast.error(error?.response?.data?.message || "Thêm môn học thất bại!");
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

  const { data: instructorsData, isFetching: instructorsIsFetching } = useQuery<
    ApiSuccessResponse<InstructorReponse[]>,
    ApiErrorResponse,
    InstructorReponse[]
  >({
    queryFn: async () =>
      await instructorGetAllByDepartmentId({
        department_id: parseInt(departmentId),
        preload: false,
        select: ["id", "first_name", "last_name"],
      }),
    select: (res) => res?.data,
    queryKey: [
      "instructors",
      "department",
      { id: parseInt(departmentId), preload: false, select: ["id", "first_name", "last_name"] },
    ],
    enabled: !departmentsIsPending && !!departmentId,
  });

  const handleSubmit = () => {
    addForm.handleSubmit((data: AddClassFormValidate) => {
      addMutate({
        name: data?.name,
        max_students: parseInt(data?.max_students),
        department_id: parseInt(data?.department_id),
        host_instructor_id: data?.host_instructor_id,
      });
    })();
  };

  return (
    <CrudModal title="Thêm lớp học" btnText="Thêm" isPending={addIsPending} handleSubmit={handleSubmit}>
      <Form {...addForm}>
        <form method="post" className="space-y-3">
          <FormField
            control={addForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoFocus
                    label="Tên"
                    placeholder="Nhập tên lớp học"
                    isInvalid={!!addForm.formState.errors.name}
                    isRequired
                    variant="faded"
                    onClear={() => addForm.setValue("name", "")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addForm.control}
            name="max_students"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoFocus
                    label="Số lượng"
                    placeholder="Số lượng sinh viên tối đa"
                    isInvalid={!!addForm.formState.errors.max_students}
                    isRequired
                    variant="faded"
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">%</span>
                      </div>
                    }
                    onClear={() => addForm.setValue("max_students", "")}
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
          <FormField
            control={addForm.control}
            name="host_instructor_id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    isInvalid={!!addForm.formState.errors.host_instructor_id}
                    isRequired
                    variant="faded"
                    isLoading={instructorsIsFetching}
                    isDisabled={instructorsIsFetching || !departmentId}
                    disabledKeys={[field.value]}
                    items={instructorsData ?? []}
                    label="Chọn giảng viên chủ nhiệm"
                    selectedKeys={[field.value]}
                    {...field}>
                    {(item) => (
                      <SelectItem key={item.id} className="capitalize">
                        {item.first_name + " " + item.last_name}
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

export default AddClassModal;
