import React from "react";
import MDEditor from "@uiw/react-md-editor";
import styled from "styled-components";
import rehypeSanitize from "rehype-sanitize";

const MdEditor = ({ value, onChange, placeholder }) => {
  return (
    <>
      <MDEditor
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
      />
    </>
  );
};

export const PreviewMd = ({ value }) => {
  return (
    <PreviewWrapper className="previewmd">
      <MDEditor.Markdown source={value} linkTarget="_blank" rehypePlugins={[[rehypeSanitize]]}/>
    </PreviewWrapper>
  );
};

const PreviewWrapper = styled.div`
  margin-top: 24px;
  & p img {
    width: 100%;
  }
`;

export default MdEditor;
