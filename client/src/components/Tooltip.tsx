interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip = ({ content, children }: TooltipProps) => {
  if (!content) {
    return <>{children}</>;
  }
  return (
    <div className="tooltip">
      {children}
      <div className="tooltip__content">{content}</div>
    </div>
  );
};
