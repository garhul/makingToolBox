import { ReactNode } from 'react'

function Modal({ children, onClose }: { children: ReactNode, onClose: () => void }) {
  return (
    <>
      <div className="modalBackdrop" onClick={() => onClose()} />
      <div className="modalContainer">
        <div className="modalContent">
          {children}
        </div>
      </div>
    </>
  )
}


export default function AboutModal({ onClose }: { onClose: () => void }) {

  return (
    <Modal onClose={onClose}>
      <>
        <h2>Some really nice about will go here</h2>
        <p>
          But we have nothing for now, this will be a lorem ipsum
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Praesent suscipit tortor neque, at egestas libero laoreet sed.
          Donec elit urna, pulvinar et euismod non, aliquet sed nibh.
          Suspendisse accumsan, eros in elementum feugiat, elit massa mattis metus, id dignissim purus nisi nec elit.
          Nullam placerat molestie ante ac finibus. Sed facilisis a mi et tempor.
          Aenean auctor posuere ante eget molestie. Aliquam dictum lorem mi, sed consequat magna mollis nec. Fusce auctor consequat nibh, non sollicitudin urna laoreet sed.
        </p>
        <p>Morbi quis nunc sollicitudin, rutrum ex a, ornare felis. Vivamus cursus tellus ut sapien laoreet, sit amet bibendum ante condimentum. Proin in gravida neque, sit amet sollicitudin mauris. Proin et mattis lectus. Aenean sagittis consectetur mauris et consectetur. Quisque sapien dui, tincidunt ac sodales nec, accumsan sed dui. Morbi dui sapien, sollicitudin eu dignissim feugiat, pharetra eu leo. Curabitur vitae sapien malesuada orci rutrum egestas nec a dui. Cras vel finibus diam. Mauris pretium tincidunt viverra. Donec nec nisl sapien. Praesent ante risus, imperdiet nec purus sagittis, laoreet euismod ante. Fusce porta semper ex, vel laoreet quam malesuada nec.</p>
      </>
    </Modal>);
}