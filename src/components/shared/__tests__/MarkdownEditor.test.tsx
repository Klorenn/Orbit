import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MarkdownEditor } from "../MarkdownEditor";

describe("MarkdownEditor", () => {
  it("renders a textarea", () => {
    render(<MarkdownEditor value="" onChange={() => {}} />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
  });

  it("displays the current value in the textarea", () => {
    render(
      <MarkdownEditor value="Hello **world**" onChange={() => {}} />,
    );
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("Hello **world**");
  });

  it("calls onChange when typing in the textarea", () => {
    const handleChange = vi.fn();
    render(<MarkdownEditor value="" onChange={handleChange} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "new text" } });
    expect(handleChange).toHaveBeenCalledWith("new text");
  });

  it("renders Write and Preview tabs", () => {
    render(<MarkdownEditor value="" onChange={() => {}} />);
    expect(screen.getByText("Write")).toBeInTheDocument();
    expect(screen.getByText("Preview")).toBeInTheDocument();
  });

  it("toggles to preview mode and shows rendered markdown", () => {
    render(
      <MarkdownEditor
        value="# Hello\n\nThis is **bold** text"
        onChange={() => {}}
      />,
    );
    // Click Preview tab
    fireEvent.click(screen.getByText("Preview"));
    // Should render markdown: h1 and bold
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Hello",
    );
    expect(screen.getByText("bold")).toBeInTheDocument();
  });

  it("uses custom placeholder", () => {
    render(
      <MarkdownEditor
        value=""
        onChange={() => {}}
        placeholder="Write your post..."
      />,
    );
    const textarea = screen.getByPlaceholderText("Write your post...");
    expect(textarea).toBeInTheDocument();
  });
});
