import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/http";
import { useModalStore } from "@/stores/modal-store";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AddStudentRegistrationFormValidate, AddStudentRegistrationFormValidateSchema } from "./add.validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { DepartmentResponse, departmentGetAll } from "@/api/departments";
import CrudModal from "../../crud-modal";
import { useEffect } from "react";
import { SubjectResponse } from "@/api/subjects";
import { StudentResponse } from "@/api/students";
import {
  RegistrationCreateParams,
  RegistrationResponse,
  registrationCreate,
  registrationGetAll,
} from "@/api/registration";

const AddStudentRegistrationModal = () => {
  const queryClient = useQueryClient();

  const { modalClose } = useModalStore();

  const addForm = useForm<AddStudentRegistrationFormValidate>({
    resolver: zodResolver(AddStudentRegistrationFormValidateSchema),
    defaultValues: {
      department_id: "",
      student_id: "",
      subject_id: "",
    },
  });

  const departmentId = addForm.watch("department_id");
  const studentId = addForm.watch("student_id");

  useEffect(() => {
    addForm.setValue("student_id", "");
  }, [addForm, departmentId]);

  useEffect(() => {
    addForm.setValue("subject_id", "");
  }, [addForm, studentId]);

  const { mutate: addMutate, isPending: addIsPending } = useMutation<
    ApiSuccessResponse<RegistrationResponse>,
    ApiErrorResponse,
    RegistrationCreateParams
  >({
    mutationFn: async (params) => await registrationCreate(params),
    onSuccess: (res) => {
      toast.success("Đăng ký môn học mới thành công !");
      queryClient.setQueryData(["registrations"], (oldData: ApiSuccessResponse<RegistrationResponse[]>) =>
        oldData
          ? {
              ...oldData,
              data: [...oldData.data, res.data],
            }
          : oldData
      );
      queryClient.setQueryData(["students"], (oldData: ApiSuccessResponse<StudentResponse[]>) =>
        oldData
          ? {
              ...oldData,
              data: oldData.data.map((department) =>
                department.id === res.data.student_id
                  ? {
                      ...department,
                      registrations: [...department.registrations, res.data],
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
                      student_registrations: [...subject.student_registrations, res.data],
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
      toast.error(error?.response?.data?.message || "Đăng ký môn học thất bại!");
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

  const { data: registrationsData, isPending: registrationsIsPending } = useQuery<
    ApiSuccessResponse<RegistrationResponse[]>,
    ApiErrorResponse,
    RegistrationResponse[]
  >({
    queryKey: ["registrations"],
    queryFn: async () => await registrationGetAll(),
    select: (res) => res?.data,
    enabled: !!studentId,
  });

  const handleSubmit = () => {
    addForm.handleSubmit((data: AddStudentRegistrationFormValidate) => {
      addMutate({
        student_id: data.student_id,
        subject_id: data.subject_id,
      });
    })();
  };

  return (
    <CrudModal title="Đăng ký môn học" btnText="Đăng ký" isPending={addIsPending} handleSubmit={handleSubmit}>
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
                    label="Chọn khoa đăng ký"
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
            name="student_id"
            render={({ field }) => {
              const currStudent = departmentsData?.find(
                (department) => department.id === parseInt(departmentId)
              )?.students;
              return (
                <FormItem>
                  <FormControl>
                    <Autocomplete
                      defaultItems={currStudent || []}
                      aria-label="Chọn sinh viên đăng ký"
                      placeholder="Nhập tên sinh viên"
                      label="Chọn sinh viên đăng ký"
                      radius="lg"
                      variant="bordered"
                      color="secondary"
                      errorMessage={addForm.formState.errors.student_id?.message}
                      selectedKey={field.value}
                      onSelectionChange={field.onChange}
                      disabledKeys={[field.value]}
                      isRequired
                      isLoading={departmentsIsPending}
                      isDisabled={departmentsIsPending || !departmentId}
                      isInvalid={!!addForm.formState.errors.student_id}
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
              );
            }}
          />
          <FormField
            control={addForm.control}
            name="subject_id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Autocomplete
                    defaultItems={
                      departmentsData?.find((department) => department.id === parseInt(departmentId))?.subjects ?? []
                    }
                    aria-label="Chọn môn học đăng ký"
                    placeholder="Nhập tên môn học"
                    label="Chọn môn học đăng ký"
                    radius="lg"
                    variant="bordered"
                    color="secondary"
                    errorMessage={addForm.formState.errors.subject_id?.message}
                    isInvalid={!!addForm.formState.errors.subject_id}
                    selectedKey={field.value}
                    onSelectionChange={field.onChange}
                    disabledKeys={[
                      field.value,
                      ...(registrationsData?.map((registration) => {
                        if (registration.student_id === studentId) return registration.subject_id;
                        return "";
                      }) ?? []),
                    ]}
                    isRequired
                    isLoading={registrationsIsPending}
                    isDisabled={registrationsIsPending || !studentId}
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

export default AddStudentRegistrationModal;
