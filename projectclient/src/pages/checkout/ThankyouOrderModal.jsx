import { Image, Modal } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NOT_FOUND_IMG, THANKYOU_IMG_1 } from "src/common/constant";
import AnimatedButton from "src/components/button/AnimatedButton";
import AnimateBgSquares from "src/components/images/AnimateBgSquares";
import styled from "styled-components";

const ThankyouOrderModal = ({ initvisible = false }) => {
  let navigate = useNavigate();
  const [visible, setVisible] = useState(initvisible);
  return (
    <Modal
      visible={visible}
      destroyOnClose
      footer={null}
      onCancel={() => {
        navigate("/profile", { replace: true });
        setVisible(false);
      }}
    >
      <ModalBodyWrapper>
        <div className="overlay">
          <AnimateBgSquares className="primary" />
        </div>
        <div className="thankyou-wrapper">
          <Image preview={false} src={THANKYOU_IMG_1} alt="THANKYOU_IMG" fallback={NOT_FOUND_IMG} />
          <div className="actions">
            <AnimatedButton onClick={() => navigate("/store", { replace: true })}>
              Tiếp tục mua hàng
            </AnimatedButton>
          </div>
        </div>
      </ModalBodyWrapper>
    </Modal>
  );
};
const ModalBodyWrapper = styled.div`
  position: relative;
  overflow: hidden;
  & .overlay {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 360px;
    z-index: 0;
  }
  & .thankyou-wrapper {
    position: relative;
    width: 100%;
    height: 360px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    z-index: 1;
    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  & .actions {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export default ThankyouOrderModal;
