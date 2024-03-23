import { DepartmentResponse, departmentGetAll } from "@/api/departments";
import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/http";
import { useModalStore } from "@/stores/modal-store";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AddSubjectFormValidate, AddSubjectFormValidateSchema } from "./add.validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { SubjectCreateParams, SubjectResponse, subjectCreate } from "@/api/subjects";
import CrudModal from "../crud-modal";

const AddSubjectModal = () => {
  const queryClient = useQueryClient();

  const { modalClose } = useModalStore();

  const addForm = useForm<AddSubjectFormValidate>({
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
      queryClient.setQueryData(["subjects"], (oldData: ApiSuccessResponse<SubjectResponse[]>) =>
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

  const handleSubmit = () => {
    addForm.handleSubmit((data: AddSubjectFormValidate) => {
      addMutate({
        name: data?.name,
        credits: parseInt(data?.credits),
        process_percentage: parseInt(data?.process_percentage),
        midterm_percentage: parseInt(data?.midterm_percentage),
        final_percentage: parseInt(data?.final_percentage),
        department_id: parseInt(data?.department_id),
      });
    })();
  };

  return (
    <CrudModal title="Thêm môn học" btnText="Thêm" isPending={addIsPending} handleSubmit={handleSubmit}>
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
                    placeholder="Nhập tên môn học"
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
            name="credits"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoFocus
                    label="Tín chỉ"
                    placeholder="Nhập số tín chỉ"
                    isInvalid={!!addForm.formState.errors.credits}
                    isRequired
                    variant="faded"
                    onClear={() => addForm.setValue("credits", "")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addForm.control}
            name="process_percentage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoFocus
                    label="Quá trình"
                    placeholder="Nhập % quá trình"
                    isInvalid={!!addForm.formState.errors.process_percentage}
                    isRequired
                    variant="faded"
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">%</span>
                      </div>
                    }
                    onClear={() => addForm.setValue("process_percentage", "")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addForm.control}
            name="midterm_percentage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoFocus
                    label="Giữa kì"
                    placeholder="% giữa kì"
                    isInvalid={!!addForm.formState.errors.midterm_percentage}
                    isRequired
                    variant="faded"
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">%</span>
                      </div>
                    }
                    onClear={() => addForm.setValue("midterm_percentage", "")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addForm.control}
            name="final_percentage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoFocus
                    label="Cuối kì"
                    placeholder="% cuối kì"
                    isInvalid={!!addForm.formState.errors.final_percentage}
                    isRequired
                    variant="faded"
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">%</span>
                      </div>
                    }
                    onClear={() => addForm.setValue("final_percentage", "")}
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
                    {...field}>
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
    </CrudModal>
  );
};

export default AddSubjectModal;
