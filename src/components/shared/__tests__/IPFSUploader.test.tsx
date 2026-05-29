import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { IPFSUploader } from "../IPFSUploader";

describe("IPFSUploader", () => {
  it("renders the drop zone", () => {
    render(<IPFSUploader onUpload={() => {}} />);
    expect(
      screen.getByText(/Drag files or click to upload/i),
    ).toBeInTheDocument();
  });

  it("accepts files via click input", () => {
    const handleUpload = vi.fn();
    render(<IPFSUploader onUpload={handleUpload} />);

    // Find the hidden file input
    const fileInput = screen.getByTestId("file-input") as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();

    // Simulate file selection
    const file = new File(["test content"], "test.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(handleUpload).toHaveBeenCalledWith([file]);
  });

  it("renders with custom accept and maxSize props", () => {
    render(
      <IPFSUploader
        onUpload={() => {}}
        accept="image/*"
        maxSize={5 * 1024 * 1024}
      />,
    );
    expect(
      screen.getByText(/Drag files or click to upload/i),
    ).toBeInTheDocument();
    // Should show max size info
    expect(screen.getByText(/5 MB/i)).toBeInTheDocument();
  });
});
