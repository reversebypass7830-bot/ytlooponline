import type { HTMLAttributes, ReactElement, ReactNode } from "react";

type StyledDivProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

type StyledTemplate = (
  strings: TemplateStringsArray,
  ...expressions: unknown[]
) => (props: StyledDivProps) => ReactElement;

const styled = {
  div: ((strings: TemplateStringsArray, ...expressions: unknown[]) => {
    const css = strings.reduce(
      (result, string, index) =>
        `${result}${string}${expressions[index] ?? ""}`,
      "",
    );

    return function StyledDiv({ children, ...props }: StyledDivProps) {
      return (
        <div {...props}>
          <style dangerouslySetInnerHTML={{ __html: css }} />
          {children}
        </div>
      );
    };
  }) as StyledTemplate,
};

export default styled;