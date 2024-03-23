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
    })
    .trim(),
  credits: z
    .string({
      required_error: "Vui lòng nhập số tín chỉ.",
    })
    .trim(),
  process_percentage: z
    .string({
      required_error: "Vui lòng nhập % quá trình.",
    })
    .trim(),
  midterm_percentage: z
    .string({
      required_error: "Vui lòng nhập % giữa kì.",
    })
    .trim(),
  final_percentage: z
    .string({
      required_error: "Vui lòng nhập % cuối kì.",
    })
    .trim(),
  department_id: z
    .string({
      required_error: "Khoa không được để trống.",
    })
    .trim(),
});

export type AddSubjectFormValidate = z.infer<typeof AddSubjectFormValidateSchema>;
