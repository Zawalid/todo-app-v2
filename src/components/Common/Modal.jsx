export default function Modal({ children, isOpen, className }) {
  return (
    <Overlay isOpen={isOpen}>
      <Content isOpen={isOpen} className={className}>
        {children}
      </Content>
    </Overlay>
  );
}

function Overlay({ children, isOpen }) {
  return (
    <div
      className={`fixed left-0 top-0 z-[9999]  flex h-full w-full items-center justify-center bg-black/25 backdrop-blur-[1px] ${
        isOpen ? 'visible' : 'invisible'
      } `}
    >
      {children}
    </div>
  );
}

function Content({ children, isOpen, className }) {
  return (
    <div
      className={`rounded-lg border border-border bg-background-primary ${className} ${
        isOpen ? 'scale-100' : 'scale-0'
      }`}
    >
      {children}
    </div>
  );
}
