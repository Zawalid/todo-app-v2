export default function Modal({ children, isOpen, onClose, className }) {
  return (
    <Overlay isOpen={isOpen} onClose={onClose}>
      <Content isOpen={isOpen} className={className}>
        {children}
      </Content>
    </Overlay>
  );
}

export function Overlay({ children, isOpen, onClose }) {
  return (
    <div
      className={`fixed left-0 top-0 z-[99999]  flex h-full w-full items-center justify-center bg-black/25 backdrop-blur-[1px] ${
        isOpen ? 'visible' : 'invisible'
      } `}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
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
