const mdSample = `# Markdown Extended Accordion

::::accordion{title="Click to expand" expanded="true"}
This is the content inside the accordion.

- You can include **bold text**
- Or _italic text_
- Or even [links](https://example.com)
::::accordionend

::::accordion{title="Code Preview"}
  \`\`\` javascript
  const foo = 'bar';
  
  console.log(foo);
  \`\`\`
::::accordionend

::::accordion{title="Image Preview"}
![Test image](https://plus.unsplash.com/premium_photo-1669829646756-083a328c0abb?q=80&w=2118&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D "test image")
::::accordionend

::::accordion{title="Another Section" level="2" class="important"}
This is another section with a different heading level and custom class.
::::accordionend

---

# Markdown Extended Alert

> [!IMPORTANT]
> This is an important alert.

> [!WARNING]
> This is a warning alert.

---

# Markdown Extended Footnotes

This is a paragraph with a footnote reference[^1].

Here's another paragraph with a footnote[^4].

This statement needs a citation[^source].

This needs further explanation[^explanation].

This has an important caveat[^note].

## Custom Footnotes Section

[footnotes]

## Additional Content

This content appears after the footnotes.

[^1]: This is the first footnote.
[^4]: This is the second footnote with **bold** text.
[^source]: Smith, J. (2023). Research findings.
[^explanation]: This refers to the process described in section 2.1.
[^note]: Only applies under specific conditions.

---

# Markdown Extended Tables

## Column Spanning

| H1      | H2      | H3      |
|---------|---------|---------|
| This cell spans 3 columns |||

## Row Spanning

| H1           | H2      |
|--------------|---------|
| This cell    | Cell A  |
| spans three ^| Cell B  |
| rows        ^| Cell C  |

## Multi-row headers

| This header spans two   || Header A |
| columns *and* two rows ^|| Header B |
|-------------|------------|----------|
| Cell A      | Cell B     | Cell C   |

---

# Markdown Extended Tabs

::::tabs
:::tab{label="JS Code" icon="♻️"}
\`\`\`js
console.log("Hello from JS");
\`\`\`
:::tabend

:::tab{label="Python Code" icon="🐍"}
\`\`\`python
print("Hello from Python")
\`\`\`
:::tabend

:::tab{label="Image"}
![Test image](https://plus.unsplash.com/premium_photo-1669829646756-083a328c0abb?q=80&w=2118&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D "test image")

You can also include a brief description or caption here.
:::tabend

:::tab{label="Text"}
Some text here.
:::tabend
::::tabsend

---

# Markdown Extended Timeline

::::timeline
:::event{date="2023-01-15"}
# Product Launch
Initial release of our software with the following features:
- User authentication
- Basic dashboard
- File uploads
:::eventend

:::event{date="2023-03-20"}
# Version 1.1
## Feature Updates
Added new capabilities and fixed several bugs:

\`\`\`js
// New API endpoint example
app.get('/api/v1.1/stats', (req, res) => {
  return res.json({ uptime: '99.9%', users: 1250 });
});
\`\`\`
:::eventend

:::event{date="2023-06-10" active="true"}
# Version 2.0
Major architecture overhaul with improved performance:

1. Migrated to microservices
2. Implemented Redis caching
3. Added real-time notifications
:::eventend

:::event{date="2023-12-01"}
# Year End Update
Planning for next year's roadmap
:::eventend
::::timelineend

---

# Markdown Extended Lists

## Ordered lists

1. Item 1
2. Item 2
    1. Item 2.1
    2. Item 2.2
        1. Item 2.2.1
        2. Item 2.2.2
    3. Item 2.3
3. Item 3

## Ordered lists with different types

1. Numeric
    1. Item 1
2. Alphabetic
    a. Item 1
3. Roman
    i. Item 1
    ii. Item 2

## Task lists

- [x] Task 1
- [ ] Task 2
- [x] Task 3

## Mixed lists

1. Item 1
    - Subitem 1
    - Subitem 2
2. Item 2
    - Subitem 1
    - Subitem 2
        1. Subsubitem 1
        2. Subsubitem 2
    - Subitem 3
        - [x] Task 4

---

# Markdown Extended Spoiler

## Text Spoiler

::::spoiler{title="Hover on text" theme="info"}
This is a hidden code block that will only appear on hover. Some text later it will be all over again and again, so be sure that it will work
::::spoilerend

## Image Spoiler

::::spoiler{title="Hover on image"}
![Test image](https://plus.unsplash.com/premium_photo-1669829646756-083a328c0abb?q=80&w=2118&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D "test image")
::::spoilerend

## Code Spoiler

::::spoiler{title="Hover on code"}
  \`\`\` javascript
  const foo = 'bar';
  
  console.log(foo);
  \`\`\`
::::spoilerend

---

# Markdown Extended Typography

He said, (--) \\"A 'simple' sentence. . .\\" (---) unknown

(Omega) - (alpha) - (beta) (--) (smile) (--) (check) (---) (pi)

Copyright (C^) 2025. All rights reserved.

---
`;

export default mdSample;
