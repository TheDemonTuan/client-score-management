import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/http";
import { useModalStore } from "@/stores/modal-store";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useShallow } from "zustand/react/shallow";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { EditClassFormValidate, EditClassFormValidateSchema } from "./edit.validate";
import CrudModal from "../crud-modal";
import { ClassResponse, ClassUpdateByIdParams, classUpdateById } from "@/api/classes";
import { DepartmentResponse, departmentGetById } from "@/api/departments";
import { InstructorReponse, instructorGetAllByDepartmentId } from "@/api/instructors";

const EditClassModal = () => {
  const queryClient = useQueryClient();

  const { modalClose, modalData } = useModalStore(
    useShallow((state) => ({
      modalClose: state.modalClose,
      modalData: state.modalData as ClassResponse,
    }))
  );

  const editForm = useForm<EditClassFormValidate>({
    resolver: zodResolver(EditClassFormValidateSchema),
    values: {
      name: modalData?.name || "",
      max_students: modalData?.max_students + "" || "",
      department_id: modalData?.department_id + "" || "",
      host_instructor_id: modalData?.host_instructor_id + "" || "",
    },
  });

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

  const { data: instructorsData, isFetching: instructorsIsFetching } = useQuery<
    ApiSuccessResponse<InstructorReponse[]>,
    ApiErrorResponse,
    InstructorReponse[]
  >({
    queryFn: async () =>
      await instructorGetAllByDepartmentId({
        department_id: modalData?.department_id,
        preload: false,
        select: ["id", "first_name", "last_name"],
      }),
    select: (res) => res?.data,
    queryKey: [
      "instructors",
      "department",
      { id: modalData?.department_id, preload: false, select: ["id", "first_name", "last_name"] },
    ],
  });

  const { mutate: editMutate, isPending: editIsPending } = useMutation<
    ApiSuccessResponse<ClassResponse>,
    ApiErrorResponse,
    ClassUpdateByIdParams
  >({
    mutationFn: async (params) => await classUpdateById(params),
    onSuccess: (res) => {
      toast.success("Cập nhật lớp học thành công !");
      queryClient.setQueryData(["classes"], (oldData: ApiSuccessResponse<ClassResponse[]>) =>
        oldData
          ? {
              ...oldData,
              data: oldData.data.map((item) => (item.id === res.data.id ? res.data : item)),
            }
          : oldData
      );
      modalClose();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Cập nhật khoa thất bại!");
    },
  });

  const handleSubmit = () => {
    editForm.handleSubmit((data: EditClassFormValidate) => {
      editMutate({
        id: modalData?.id,
        name: data?.name,
        max_students: parseInt(data?.max_students),
        host_instructor_id: data?.host_instructor_id,
      });
    })();
  };

  return (
    <CrudModal title="Sửa lớp học" btnText="Cập nhật" isPending={editIsPending} handleSubmit={handleSubmit}>
      <Form {...editForm}>
        <form method="post" className="space-y-3">
          <FormField
            control={editForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoFocus
                    label="Tên"
                    placeholder={modalData?.name || "Tên lớp học"}
                    isInvalid={!!editForm.formState.errors.name}
                    isRequired
                    variant="faded"
                    onClear={() => editForm.setValue("name", "")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editForm.control}
            name="max_students"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoFocus
                    label="Số lượng"
                    placeholder={modalData?.max_students + "" ?? "Số lượng sinh viên tối đa"}
                    isInvalid={!!editForm.formState.errors.max_students}
                    isRequired
                    variant="faded"
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">%</span>
                      </div>
                    }
                    onClear={() => editForm.setValue("max_students", "")}
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
          <FormField
            control={editForm.control}
            name="host_instructor_id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    isInvalid={!!editForm.formState.errors.host_instructor_id}
                    isRequired
                    variant="faded"
                    isLoading={instructorsIsFetching}
                    isDisabled={instructorsIsFetching}
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

export default EditClassModal;
