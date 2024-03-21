import { z } from "zod";

export const AddSubjectFormValidateSchema = z.object({
  name: z
    .string({
      required_error: "Vui lòng nhập tên.",
    })
    .min(3, {
      message: "Tên không được ít hơn 3 ký tự.",
    })
    .max(100, {
      message: "Tên không được quá 100 ký tự.",
    }),
  credits: z.string({
    required_error: "Vui lòng nhập số tín chỉ.",
  }),
  process_percentage: z.string({
    required_error: "Vui lòng nhập % quá trình.",
  }),
  midterm_percentage: z.string({
    required_error: "Vui lòng nhập % giữa kì.",
  }),
  final_percentage: z.string({
    required_error: "Vui lòng nhập % cuối kì.",
  }),
  department_id: z.string({
    required_error: "Khoa không được để trống.",
  }),
});

export type AddSubjectFormValidate = z.infer<typeof AddSubjectFormValidateSchema>;
