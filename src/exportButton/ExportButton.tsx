// ExportButton.tsx
import React from "react";

interface ExportButtonProps {
	onClick: () => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onClick }) => {
	return (
		<button
			className="notes__add"
			onClick={onClick}
		>
			Export Notes
		</button>
	);
};

export default ExportButton;
