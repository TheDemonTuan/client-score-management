import { Spinner } from "@nextui-org/react";

interface RequestLoadingTextProps {
  text: string;
  isLoading: boolean;
}

const RequestLoadingText = (props: RequestLoadingTextProps) => {
  return props.isLoading ? (
    <div className="flex gap-2">
      Loading... <Spinner color="default" size="sm" />
    </div>
  ) : (
    props.text
  );
};

export default RequestLoadingText;
