import { z } from "zod";

export const EditClassFormValidateSchema = z.object({
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
max_students: z
  .string({
    required_error: "Số lượng tối đa không được để trống.",
  })
  .trim(),
department_id: z
  .string({
    required_error: "Khoa không được để trống.",
  })
  .trim(),
host_instructor_id: z
  .string({
    required_error: "Giảng viên chủ nhiêm không được để trống.",
  })
  .trim(),
});

export type EditClassFormValidate = z.infer<typeof EditClassFormValidateSchema>;
