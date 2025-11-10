---
title: "Windows - Change Drive Letter"
description: "Using a CLI natively available on Windows"
image: /tips/desktop-productivity-layout.png
imageAlt: Desktop productivity layout
date: 2025-11-04
categories:
  - Command Line
tags:
  - Windows
draft: true
---

To change the drive letter of your CD-ROM drive (if it is currently E:) in Windows, you can achieve it in several manner. However, follow these steps to perform the task quickly:

1. **Open Command Prompt as Administrator**:
   - Press `Windows + X` → select **Command Prompt (Admin)** or **Windows PowerShell (Admin)**.
2. **Launch DiskPart**:

   ```powershell
   diskpart
   ```

3. **List all volumes**:

   ```powershell
   list volume
   ```

   Identify the volume number of your CD-ROM drive (look for the one with type `CD-ROM` and letter `E`).

4. **Select the CD-ROM volume**:

   ```powershell
   select volume
   ```

   Replace `<number>` with the actual volume number of the CD-ROM.

5. **Assign a new drive letter**:

   ```powershell
   select volume
   ```

   You can choose any unused letter (e.g., `Z`, `R`, etc.).

6. **Exit DiskPart**:

   ```powershell
   exit
   ```

## Documentation

Reference: [Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/diskpart).

{{< blockcontainer jli-notice-tip "Follow me">}}

Thanks for reading this article. Make sure to [follow me on X](https://x.com/LitzlerJeremie), [subscribe to my Substack publication](https://iamjeremie.substack.com/) and bookmark my blog to read more in the future.

{{< /blockcontainer >}}
