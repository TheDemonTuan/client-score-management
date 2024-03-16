import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { usePathNameStore } from "@/stores/pathname-store";

const Breadcrumb = () => {
  const { split } = usePathNameStore();
  return (
    <Breadcrumbs variant="bordered" underline="hover">
      <BreadcrumbItem href="/">Trang chủ</BreadcrumbItem>
      {split.map((item, index) => (
        <BreadcrumbItem className="capitalize" key={item} href={`/${split.slice(0, index + 1).join("/")}`}>
          {item}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
