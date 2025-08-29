"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import {
  Upload,
  File,
  X,
  AlertCircle,
  RefreshCw,
  Trash2,
  Eye,
  Download,
  Tag,
  Calendar,
  User,
  FileText,
  ImageIcon,
  Search,
  Clock,
} from "lucide-react"

export default function DocumentUpload() {
  const [files, setFiles] = useState([])
  const [uploadedDocuments, setUploadedDocuments] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  // Document metadata states
  const [documentMetadata, setDocumentMetadata] = useState({})

  const fileInputRef = useRef(null)

  const documentTypes = [
    { value: "document", label: "Document", icon: FileText },
    { value: "image", label: "Image", icon: ImageIcon },
    { value: "report", label: "Report", icon: FileText },
    { value: "presentation", label: "Presentation", icon: FileText },
    { value: "spreadsheet", label: "Spreadsheet", icon: FileText },
    { value: "other", label: "Other", icon: File },
  ]

  useEffect(() => {
    fetchUploadedDocuments()
  }, [])

  const fetchUploadedDocuments = async () => {
    setLoading(true)
    setError("")

    try {
      // Mock data for demonstration with version control
      const mockDocuments = [
        {
          id: 1,
          name: "Project_Report_v3.pdf",
          originalName: "Project Report.pdf",
          type: "document",
          size: 2048576,
          uploadedAt: "2024-01-15T10:30:00Z",
          uploadedBy: "John Smith",
          version: 3,
          metadata: {
            author: "John Smith",
            description: "Quarterly project status report with updated metrics",
            tags: ["report", "quarterly", "metrics"],
          },
        },
        {
          id: 2,
          name: "Design_Mockup_v2.png",
          originalName: "Design Mockup.png",
          type: "image",
          size: 1536000,
          uploadedAt: "2024-01-14T14:20:00Z",
          uploadedBy: "Jane Doe",
          version: 2,
          metadata: {
            author: "Jane Doe",
            description: "Updated UI mockup with client feedback incorporated",
            tags: ["design", "mockup", "ui"],
          },
        },
        {
          id: 3,
          name: "Budget_Analysis_v1.xlsx",
          originalName: "Budget Analysis.xlsx",
          type: "spreadsheet",
          size: 892000,
          uploadedAt: "2024-01-12T09:15:00Z",
          uploadedBy: "Mike Johnson",
          version: 1,
          metadata: {
            author: "Mike Johnson",
            description: "Initial budget analysis for Q1 planning",
            tags: ["budget", "analysis", "planning"],
          },
        },
      ]
      setUploadedDocuments(mockDocuments)
    } catch (error) {
      console.error("Error fetching documents:", error)
      setError("Failed to load documents")
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter((file) => {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/gif",
        "text/plain",
      ]
      return validTypes.includes(file.type)
    })

    if (validFiles.length !== selectedFiles.length) {
      setError("Only PDF, Word, image, and text files are allowed")
      return
    }

    if (validFiles.some((file) => file.size > 25 * 1024 * 1024)) {
      setError("File size must be less than 25MB")
      return
    }

    setError("")
    setFiles(validFiles)

    // Initialize metadata for each file
    const metadata = {}
    validFiles.forEach((file, index) => {
      metadata[index] = {
        type: "document",
        description: "",
        author: "",
        tags: "",
      }
    })
    setDocumentMetadata(metadata)
  }

  const updateFileMetadata = (fileIndex, field, value) => {
    setDocumentMetadata((prev) => ({
      ...prev,
      [fileIndex]: {
        ...prev[fileIndex],
        [field]: value,
      },
    }))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const droppedFiles = e.dataTransfer.files
    handleFileSelect(droppedFiles)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    for (let i = 0; i < files.length; i++) {
      const metadata = documentMetadata[i]
      if (!metadata?.type || !metadata?.author) {
        setError(`Please fill in document type and author for ${files[i].name}`)
        return
      }
    }

    setUploading(true)
    setError("")

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const metadata = documentMetadata[i]

        // Simulate upload with version control
        const newDocument = {
          id: Date.now() + i,
          name: file.name,
          originalName: file.name,
          type: metadata.type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          uploadedBy: metadata.author,
          version: 1, // New documents start at version 1
          metadata: {
            author: metadata.author,
            description: metadata.description,
            tags: metadata.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
          },
        }

        setUploadedDocuments((prev) => [newDocument, ...prev])
      }

      setFiles([])
      setDocumentMetadata({})
      setError("")
      alert(`Successfully uploaded ${files.length} document(s)!`)
    } catch (error) {
      console.error("Upload error:", error)
      setError(`Upload failed: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
    const newMetadata = { ...documentMetadata }
    delete newMetadata[index]
    setDocumentMetadata(newMetadata)
  }

  const handlePreview = async (document) => {
    console.log("Attempting to preview document:", document.name)

    try {
      const blob = new Blob(["Document content preview"], { type: "application/pdf" })
      const blobUrl = URL.createObjectURL(blob)

      const newWindow = window.open(blobUrl, "_blank")
      if (!newWindow) {
        alert("Popup blocked! Please allow popups for this site and try again.")
      }

      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
    } catch (error) {
      console.error("Preview failed:", error)
      setError("Failed to preview document. Please try downloading instead.")
    }
  }

  const handleDownload = async (document) => {
    try {
      const blob = new Blob(["Document content"], { type: "application/octet-stream" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = document.originalName || document.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
      setError("Failed to download document.")
    }
  }

  const handleDelete = async (documentId) => {
    if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      return
    }

    setDeleting(documentId)
    setError("")

    try {
      setUploadedDocuments(uploadedDocuments.filter((doc) => doc.id !== documentId))
    } catch (error) {
      console.error("Delete error:", error)
      setError("Delete failed")
    } finally {
      setDeleting(null)
    }
  }

  const getFileIcon = (type) => {
    const typeData = documentTypes.find((t) => t.value === type)
    return typeData ? typeData.icon : File
  }

  const filteredDocuments = uploadedDocuments.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.metadata?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || doc.type === filterType
    return matchesSearch && matchesType
  })

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "size":
        return b.size - a.size
      case "type":
        return a.type.localeCompare(b.type)
      default: // date
        return new Date(b.uploadedAt) - new Date(a.uploadedAt)
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4 py-8">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Document Management</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload, preview, and manage your documents with version control, metadata tracking, and easy downloads.
          </p>
        </div>

        {/* Upload Section */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl text-blue-600">
              <Upload className="h-7 w-7" />
              Upload Documents
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Supported formats: PDF, Word (.doc/.docx), Images (JPEG, PNG, GIF), Text files. Maximum file size: 25MB
              per file.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                dragActive
                  ? "border-blue-400 bg-blue-50 shadow-lg scale-[1.02]"
                  : "border-gray-300 hover:border-blue-400 hover:bg-gray-50 hover:shadow-md"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={`transition-all duration-300 ${dragActive ? "scale-110" : ""}`}>
                <Upload
                  className={`h-16 w-16 mx-auto mb-6 transition-colors ${dragActive ? "text-blue-500" : "text-gray-400"}`}
                />
                <p className="text-2xl font-bold text-gray-700 mb-2">
                  {dragActive ? "Drop files here" : "Drag and drop documents here"}
                </p>
                <p className="text-lg text-gray-500">or click to browse your files</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 shadow-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {files.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Selected Files ({files.length}):</h3>
                <div className="space-y-6">
                  {files.map((file, index) => {
                    const metadata = documentMetadata[index] || {}
                    const IconComponent = getFileIcon(metadata.type)

                    return (
                      <div
                        key={index}
                        className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <IconComponent className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{file.name}</p>
                              <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="h-10 w-10 p-0 hover:bg-red-100 hover:text-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">Document Type *</Label>
                            <Select
                              value={metadata.type}
                              onValueChange={(value) => updateFileMetadata(index, "type", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type..." />
                              </SelectTrigger>
                              <SelectContent>
                                {documentTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    <div className="flex items-center gap-2">
                                      <type.icon className="h-4 w-4" />
                                      {type.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">Author *</Label>
                            <Input
                              placeholder="Document author"
                              value={metadata.author}
                              onChange={(e) => updateFileMetadata(index, "author", e.target.value)}
                            />
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">
                              Tags (comma-separated)
                            </Label>
                            <Input
                              placeholder="e.g., important, draft, review"
                              value={metadata.tags}
                              onChange={(e) => updateFileMetadata(index, "tags", e.target.value)}
                            />
                          </div>

                          <div className="md:col-span-1">
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">Description</Label>
                            <Textarea
                              placeholder="Brief description of the document..."
                              value={metadata.description}
                              onChange={(e) => updateFileMetadata(index, "description", e.target.value)}
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-3" />
                      Upload {files.length} Document{files.length > 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Library */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-blue-600">
                <File className="h-7 w-7" />
                Document Library ({sortedDocuments.length})
              </CardTitle>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {documentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Sort by Date</SelectItem>
                    <SelectItem value="name">Sort by Name</SelectItem>
                    <SelectItem value="size">Sort by Size</SelectItem>
                    <SelectItem value="type">Sort by Type</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={fetchUploadedDocuments}
                  disabled={loading}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-16">
                <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-400" />
                <p className="text-xl text-gray-600">Loading documents...</p>
              </div>
            ) : sortedDocuments.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <File className="h-20 w-20 mx-auto mb-4 opacity-30" />
                <p className="text-xl font-medium">
                  {searchTerm || filterType !== "all"
                    ? "No documents match your search criteria"
                    : "No documents uploaded yet. Start by uploading your first document!"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedDocuments.map((document) => {
                  const IconComponent = getFileIcon(document.type)
                  const typeData = documentTypes.find((t) => t.value === document.type)

                  return (
                    <div
                      key={document.id}
                      className="group border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-bold text-gray-900 truncate mb-1"
                            title={document.originalName || document.name}
                          >
                            {document.originalName || document.name}
                          </p>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {typeData?.label || document.type}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {document.uploadedBy}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(document.uploadedAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-blue-600 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Version {document.version}
                            </p>
                          </div>
                        </div>
                      </div>

                      {document.metadata?.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{document.metadata.description}</p>
                      )}

                      {document.metadata?.tags && document.metadata.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {document.metadata.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreview(document)}
                          className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(document)}
                          className="border-green-200 text-green-600 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-200"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(document.id)}
                          disabled={deleting === document.id}
                          className="border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
                        >
                          {deleting === document.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
