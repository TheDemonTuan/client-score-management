import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/http";
import { useModalStore } from "@/stores/modal-store";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AddInstructorFormValidate, AddInstructorFormValidateSchema } from "./add.validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { DepartmentResponse, departmentGetAll } from "@/api/departments";
import CrudModal from "../../crud-modal";
import { AssignmentCreateParams, AssignmentResponse, assignmentCreate, assignmentGetAll } from "@/api/assignment";
import { useEffect } from "react";
import { InstructorReponse } from "@/api/instructors";
import { SubjectResponse } from "@/api/subjects";

const AddInstructorAssignmentModal = () => {
  const queryClient = useQueryClient();

  const { modalClose } = useModalStore();

  const addForm = useForm<AddInstructorFormValidate>({
    resolver: zodResolver(AddInstructorFormValidateSchema),
    defaultValues: {
      department_id: "",
      instructor_id: "",
      subject_id: "",
    },
  });

  const departmentId = addForm.watch("department_id");
  const instructorId = addForm.watch("instructor_id");

  useEffect(() => {
    addForm.setValue("instructor_id", "");
  }, [addForm, departmentId]);

  useEffect(() => {
    addForm.setValue("subject_id", "");
  }, [addForm, instructorId]);

  const { mutate: addMutate, isPending: addIsPending } = useMutation<
    ApiSuccessResponse<AssignmentResponse>,
    ApiErrorResponse,
    AssignmentCreateParams
  >({
    mutationFn: async (params) => await assignmentCreate(params),
    onSuccess: (res) => {
      toast.success("Phân công môn học mới thành công !");
      queryClient.setQueryData(["assignments"], (oldData: ApiSuccessResponse<AssignmentResponse[]>) =>
        oldData
          ? {
              ...oldData,
              data: [...oldData.data, res.data],
            }
          : oldData
      );
      queryClient.setQueryData(["instructors"], (oldData: ApiSuccessResponse<InstructorReponse[]>) =>
        oldData
          ? {
              ...oldData,
              data: oldData.data.map((department) =>
                department.id === res.data.instructor_id
                  ? {
                      ...department,
                      assignments: [...department.assignments, res.data],
                    }
                  : department
              ),
            }
          : oldData
      );
      queryClient.setQueryData(["subjects"], (oldData: ApiSuccessResponse<SubjectResponse[]>) =>
        oldData
          ? {
              ...oldData,
              data: oldData.data.map((subject) =>
                subject.id === res.data.subject_id
                  ? {
                      ...subject,
                      instructor_assignments: [...subject.instructor_assignments, res.data],
                    }
                  : subject
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
    queryKey: ["departments"],
    queryFn: async () => await departmentGetAll(),
    select: (res) => res?.data,
  });

  const { data: assignmentsData, isPending: assignmentsIsPending } = useQuery<
    ApiSuccessResponse<AssignmentResponse[]>,
    ApiErrorResponse,
    AssignmentResponse[]
  >({
    queryKey: ["assignments"],
    queryFn: async () => await assignmentGetAll(),
    select: (res) => res?.data,
    enabled: !!instructorId,
  });

  const handleSubmit = () => {
    addForm.handleSubmit((data: AddInstructorFormValidate) => {
      addMutate({
        instructor_id: data.instructor_id,
        subject_id: data.subject_id,
      });
    })();
  };

  return (
    <CrudModal title="Phân công môn học" btnText="Phân công" isPending={addIsPending} handleSubmit={handleSubmit}>
      <Form {...addForm}>
        <form method="post" className="space-y-4">
          <FormField
            control={addForm.control}
            name="department_id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Autocomplete
                    items={departmentsData ?? []}
                    aria-label="Chọn khoa"
                    placeholder="Nhập tên khoa"
                    label="Chọn khoa phân công"
                    radius="lg"
                    variant="bordered"
                    color="secondary"
                    errorMessage={addForm.formState.errors.department_id?.message}
                    selectedKey={field.value}
                    onSelectionChange={field.onChange}
                    disabledKeys={[field.value]}
                    isInvalid={!!addForm.formState.errors.department_id}
                    isRequired
                    isLoading={departmentsIsPending}
                    isDisabled={departmentsIsPending}
                    allowsCustomValue
                    {...field}>
                    {(item) => (
                      <AutocompleteItem key={item.id} textValue={item.name} className="capitalize">
                        {item.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={addForm.control}
            name="instructor_id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Autocomplete
                    items={
                      departmentsData?.find((department) => department.id === parseInt(departmentId))?.instructors ?? []
                    }
                    aria-label="Chọn giảng viên phân công"
                    placeholder="Nhập tên giảng viên"
                    label="Chọn giảng viên phân công"
                    radius="lg"
                    variant="bordered"
                    color="secondary"
                    errorMessage={addForm.formState.errors.instructor_id?.message}
                    selectedKey={field.value}
                    onSelectionChange={field.onChange}
                    disabledKeys={[field.value]}
                    isRequired
                    isLoading={departmentsIsPending}
                    isDisabled={departmentsIsPending || !departmentId}
                    isInvalid={!!addForm.formState.errors.instructor_id}
                    allowsCustomValue
                    {...field}>
                    {(item) => (
                      <AutocompleteItem
                        key={item.id}
                        textValue={item.first_name + " " + item.last_name}
                        className="capitalize">
                        {item.first_name + " " + item.last_name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={addForm.control}
            name="subject_id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Autocomplete
                    items={
                      departmentsData?.find((department) => department.id === parseInt(departmentId))?.subjects ?? []
                    }
                    aria-label="Chọn môn học phân công"
                    placeholder="Nhập tên môn học"
                    label="Chọn môn học phân công"
                    radius="lg"
                    variant="bordered"
                    color="secondary"
                    errorMessage={addForm.formState.errors.subject_id?.message}
                    isInvalid={!!addForm.formState.errors.subject_id}
                    selectedKey={field.value}
                    onSelectionChange={field.onChange}
                    disabledKeys={[
                      field.value,
                      ...(assignmentsData?.map((assignment) => {
                        if (assignment.instructor_id === instructorId) return assignment.subject_id;
                        return "";
                      }) ?? []),
                    ]}
                    isRequired
                    isLoading={assignmentsIsPending}
                    isDisabled={assignmentsIsPending || !instructorId}
                    allowsCustomValue
                    {...field}>
                    {(item) => (
                      <AutocompleteItem key={item.id} textValue={item.name} className="capitalize">
                        {item.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </CrudModal>
  );
};

export default AddInstructorAssignmentModal;
