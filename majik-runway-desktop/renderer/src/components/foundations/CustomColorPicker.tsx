import React, { useState } from "react";
import styled from "styled-components";
import { BlockPicker, type ColorResult } from "react-color";
import { UtilityButton } from "../../globals/buttons";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  user-select: none;
`;

const ListContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
  flex-direction: column;
  width: 100%;
`;

const RowItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  width: 100%;
`;

const ColorBox = styled.div`
  width: 48px;
  height: 24px;
  background-color: ${(props) => props.color};
  margin-right: 8px;
  border-radius: 5px;
  cursor: pointer;
`;

const HexText = styled.span`
  flex-grow: 1;
  margin-right: 5px;
  font-size: ${({ theme }) => theme.typography.sizes.body};
  font-weight: ${({ theme }) => theme.typography.weights.body};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const DeleteButton = styled(UtilityButton)`
  width: 70px;
  height: 30px;
  padding: 5px;
  margin-left: 10px;
  background-color: ${({ theme }) => theme.colors.error};
  border-color: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const AddButton = styled(UtilityButton)`
  width: 150px;
  height: 35px;
  padding: 5px;
  margin-left: 10px;
`;

const ConfirmButton = styled(UtilityButton)`
  width: 100px;
  height: 35px;
  padding: 5px;
  margin-top: 5px;
  margin-left: 10px;
`;

interface CustomColorPickerPickerProps {
  currentValue: string[];
  defaultColor?: string;
  max?: number;
  onUpdate?: (color: string[]) => void;
}

const CustomColorPicker: React.FC<CustomColorPickerPickerProps> = ({
  currentValue,
  defaultColor = "#d6f500",
  max = 10,
  onUpdate,
}) => {
  const pickedColors = currentValue || [defaultColor];

  const [isPickingColor, setIsPickingColor] = useState<boolean>(false);
  const [currentColor, setCurrentColor] = useState<string>(defaultColor);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleColorChange = (color: ColorResult) => {
    setCurrentColor(color.hex);
  };

  const addColor = () => {
    let newColors = [...pickedColors];
    if (editingIndex !== null) {
      newColors[editingIndex] = currentColor;
    } else {
      newColors = [...newColors, currentColor].slice(0, max);
    }
    onUpdate?.(newColors);
    setIsPickingColor(false);
    setEditingIndex(null);
  };

  const deleteColor = (index: number) => {
    const newColors = pickedColors.filter((_, i) => i !== index);
    onUpdate?.(newColors);
  };

  const toggleColorPicker = () => {
    setIsPickingColor((prev) => !prev);
    setEditingIndex(max === 1 ? 0 : null);
  };

  const editColor = (index: number, color: string) => {
    setCurrentColor(color);
    setIsPickingColor(true);
    setEditingIndex(index);
  };

  const buttonLabel = max === 1 ? "Pick Color" : "Add Color";

  return (
    <MainContainer>
      {isPickingColor ? (
        <div>
          <BlockPicker color={currentColor} onChange={handleColorChange} />
          <ConfirmButton onClick={addColor}>Confirm</ConfirmButton>
        </div>
      ) : (
        <>
          <ListContainer>
            {pickedColors.map((color, index) => (
              <RowItemContainer key={index}>
                <ColorBox
                  color={color}
                  onClick={() => editColor(index, color)}
                />
                <HexText>{color}</HexText>
                {max > 1 && (
                  <DeleteButton
                    onClick={() => deleteColor(index)}
                    disabled={pickedColors.length <= 1}
                  >
                    Delete
                  </DeleteButton>
                )}
              </RowItemContainer>
            ))}
          </ListContainer>
          <AddButton
            onClick={toggleColorPicker}
            disabled={pickedColors.length >= max && max > 1}
          >
            {buttonLabel}
          </AddButton>
        </>
      )}
    </MainContainer>
  );
};

export default CustomColorPicker;
