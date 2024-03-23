import dynamic from "next/dynamic";
import ModalLoading from "../modal-loading";

export const addInstructorModalKey = "add_instructor_modal";
export const editInstructorModalKey = "edit_instructor_modal";
export const deleteInstructorModalKey = "delete_instructor_modal";

export const AddInstructorModal = dynamic(() => import("@/components/Giang-Vien/add-modal"), {
  loading: () => <ModalLoading />,
});

export const EditInstructorModal = dynamic(() => import("@/components/Giang-Vien/edit-modal"), {
  loading: () => <ModalLoading />,
});

export const DeleteInstructorModal = dynamic(() => import("@/components/Giang-Vien/delete-modal"), {
  loading: () => <ModalLoading />,
});
