"use client"

import React from "react"

import { useState } from "react"
import { File, FileText, Folder, Grid, ImageIcon, List, Plus, Star, Users, Upload } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"

// Mock data structure
interface FileItem {
  id: string
  name: string
  type: "file" | "folder" | "image" | "document" | "spreadsheet"
  size?: string
  modified: string
  shared?: boolean
  starred?: boolean
  path: string
}

interface DriveFolder {
  id: string
  name: string
  files: FileItem[]
}

const mockData: Record<string, DriveFolder> = {
  root: {
    id: "root",
    name: "My Drive",
    files: [
      {
        id: "1",
        name: "Work Documents",
        type: "folder",
        modified: "May 1, 2025",
        shared: true,
        path: "work-documents",
      },
      {
        id: "2",
        name: "Personal",
        type: "folder",
        modified: "Apr 28, 2025",
        path: "personal",
      },
      {
        id: "3",
        name: "Project Proposal.docx",
        type: "document",
        size: "2.3 MB",
        modified: "Apr 30, 2025",
        starred: true,
        path: "project-proposal.docx",
      },
      {
        id: "4",
        name: "Budget 2025.xlsx",
        type: "spreadsheet",
        size: "1.8 MB",
        modified: "Apr 29, 2025",
        shared: true,
        path: "budget-2025.xlsx",
      },
      {
        id: "5",
        name: "Profile Photo.jpg",
        type: "image",
        size: "3.2 MB",
        modified: "Apr 25, 2025",
        path: "profile-photo.jpg",
      },
    ],
  },
  "work-documents": {
    id: "work-documents",
    name: "Work Documents",
    files: [
      {
        id: "6",
        name: "Meeting Notes",
        type: "folder",
        modified: "Apr 27, 2025",
        path: "work-documents/meeting-notes",
      },
      {
        id: "7",
        name: "Q1 Report.pdf",
        type: "file",
        size: "4.1 MB",
        modified: "Apr 26, 2025",
        shared: true,
        path: "work-documents/q1-report.pdf",
      },
      {
        id: "8",
        name: "Team Structure.docx",
        type: "document",
        size: "1.5 MB",
        modified: "Apr 24, 2025",
        path: "work-documents/team-structure.docx",
      },
    ],
  },
  personal: {
    id: "personal",
    name: "Personal",
    files: [
      {
        id: "9",
        name: "Vacation Photos",
        type: "folder",
        modified: "Apr 23, 2025",
        path: "personal/vacation-photos",
      },
      {
        id: "10",
        name: "Resume.pdf",
        type: "file",
        size: "2.8 MB",
        modified: "Apr 22, 2025",
        starred: true,
        path: "personal/resume.pdf",
      },
    ],
  },
  "work-documents/meeting-notes": {
    id: "work-documents/meeting-notes",
    name: "Meeting Notes",
    files: [
      {
        id: "11",
        name: "Client Meeting.docx",
        type: "document",
        size: "1.2 MB",
        modified: "Apr 21, 2025",
        path: "work-documents/meeting-notes/client-meeting.docx",
      },
      {
        id: "12",
        name: "Team Sync.docx",
        type: "document",
        size: "0.9 MB",
        modified: "Apr 20, 2025",
        path: "work-documents/meeting-notes/team-sync.docx",
      },
    ],
  },
  "personal/vacation-photos": {
    id: "personal/vacation-photos",
    name: "Vacation Photos",
    files: [
      {
        id: "13",
        name: "Beach.jpg",
        type: "image",
        size: "5.4 MB",
        modified: "Apr 19, 2025",
        path: "personal/vacation-photos/beach.jpg",
      },
      {
        id: "14",
        name: "Mountains.jpg",
        type: "image",
        size: "4.7 MB",
        modified: "Apr 18, 2025",
        path: "personal/vacation-photos/mountains.jpg",
      },
      {
        id: "15",
        name: "City.jpg",
        type: "image",
        size: "3.9 MB",
        modified: "Apr 17, 2025",
        path: "personal/vacation-photos/city.jpg",
      },
    ],
  },
}

export function DriveUI() {
  const [currentPath, setCurrentPath] = useState("root")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  const currentFolder = mockData[currentPath] || mockData.root
  const pathSegments = currentPath === "root" ? [] : currentPath.split("/")

  const getFileIcon = (type: string) => {
    switch (type) {
      case "folder":
        return <Folder className="h-5 w-5 text-blue-500" />
      case "document":
        return <FileText className="h-5 w-5 text-blue-600" />
      case "spreadsheet":
        return <FileText className="h-5 w-5 text-green-600" />
      case "image":
        return <ImageIcon className="h-5 w-5 text-purple-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const navigateToFolder = (path: string) => {
    if (mockData[path]) {
      setCurrentPath(path)
    }
  }

  const navigateToBreadcrumb = (index: number) => {
    if (index === -1) {
      setCurrentPath("root")
      return
    }

    const newPath = pathSegments.slice(0, index + 1).join("/")
    setCurrentPath(newPath)
  }

  const handleFileClick = (file: FileItem) => {
    if (file.type === "folder") {
      navigateToFolder(file.path)
    } else {
      // For files, we would normally open them or download them
      // For this mock, we'll just alert
      alert(`Opening file: ${file.name}`)
    }
  }

  return (
    <div className="flex h-screen bg-background dark text-white">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">Google Drive</h1>
              <div className="relative w-full max-w-md">
                <Input placeholder="Search in Drive" className="pl-10 text-gray-200 placeholder:text-gray-400" />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Toolbar */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={() => navigateToBreadcrumb(-1)} className="text-gray-200 hover:text-white">
                    My Drive
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {pathSegments.map((segment, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        onClick={() => navigateToBreadcrumb(index)}
                        className="text-gray-200 hover:text-white"
                      >
                        {mockData[pathSegments.slice(0, index + 1).join("/")]?.name || segment}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-2">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4" />
              New
            </Button>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload files</DialogTitle>
                </DialogHeader>
                <div className="p-6 border-2 border-dashed rounded-lg text-center">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-gray-300 mb-2">Drag and drop files here or click to browse</p>
                  <Button size="sm">Select files</Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="rounded-r-none"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="rounded-l-none"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* File list */}
        <div className="flex-1 overflow-auto p-4">
          {viewMode === "list" ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 text-gray-200">
                    <th className="text-left p-3 font-medium">Name</th>
                    <th className="text-left p-3 font-medium hidden md:table-cell">Modified</th>
                    <th className="text-left p-3 font-medium hidden md:table-cell">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {currentFolder.files.map((file) => (
                    <tr
                      key={file.id}
                      className="border-t hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleFileClick(file)}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <span>{file.name}</span>
                          {file.starred && <Star className="h-4 w-4 text-yellow-400 ml-1" />}
                          {file.shared && <Users className="h-4 w-4 text-blue-400 ml-1" />}
                        </div>
                      </td>
                      <td className="p-3 text-gray-300 hidden md:table-cell">{file.modified}</td>
                      <td className="p-3 text-gray-300 hidden md:table-cell">{file.size || "--"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {currentFolder.files.map((file) => (
                <div
                  key={file.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer flex flex-col items-center text-center"
                  onClick={() => handleFileClick(file)}
                >
                  <div className="mb-2">{getFileIcon(file.type)}</div>
                  <div className="text-sm truncate w-full text-gray-200">{file.name}</div>
                  <div className="flex items-center justify-center mt-1 gap-1">
                    {file.starred && <Star className="h-3 w-3 text-yellow-400" />}
                    {file.shared && <Users className="h-3 w-3 text-blue-400" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
