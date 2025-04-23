"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Camera as CameraType } from "@/types/camera"
import { Edit, MoreHorizontal, Play, Settings, Trash2, Video, VideoOff, Pause, Volume2, VolumeX } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface CameraCardProps {
  camera: CameraType
  index?: number
}

export function CameraCard({ camera, index = 0 }: CameraCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Function to handle video playback
  const togglePlayback = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch((err) => {
        console.error("Error playing video:", err)
        setHasError(true)
      })
    }

    setIsPlaying(!isPlaying)
  }

  // Function to toggle mute
  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  // Handle video loading
  useEffect(() => {
    if (!videoRef.current) return

    const handleCanPlay = () => {
      setIsLoading(false)
    }

    const handleError = () => {
      setIsLoading(false)
      setHasError(true)
    }

    videoRef.current.addEventListener("canplay", handleCanPlay)
    videoRef.current.addEventListener("error", handleError)

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("canplay", handleCanPlay)
        videoRef.current.removeEventListener("error", handleError)
      }
    }
  }, [])

  // For demo purposes, we'll use a sample video stream
  // In a real app, this would be the actual RTSP/HLS stream from the camera
  const getVideoSource = () => {
    // This is a sample video for demo purposes
    if (camera.status === "online") {
      return "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    }
    return ""
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
        <CardHeader className="p-0">
          <div className="relative aspect-video bg-muted">
            {camera.status === "online" ? (
              <>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Skeleton className="h-full w-full" />
                  </div>
                )}
                <video
                  ref={videoRef}
                  src={getVideoSource()}
                  className={cn("h-full w-full object-cover", isLoading && "opacity-0")}
                  muted
                  playsInline
                  loop
                />
                {hasError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
                    <p className="text-sm text-muted-foreground">Failed to load camera stream</p>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 flex gap-1">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 rounded-full bg-black/50 text-white hover:bg-black/70"
                    onClick={togglePlayback}
                  >
                    {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 rounded-full bg-black/50 text-white hover:bg-black/70"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                    <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <VideoOff className="h-10 w-10 text-muted-foreground/50" />
              </div>
            )}
            <div className="absolute bottom-2 right-2">
              <Badge
                variant={camera.status === "online" ? "default" : "secondary"}
                className={`${camera.status === "online" ? "bg-green-500" : "bg-gray-400"} text-white`}
              >
                {camera.status === "online" ? "Online" : "Offline"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-primary" />
              <h3 className="text-base font-medium">{camera.name}</h3>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuLabel>Camera Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Play className="mr-2 h-4 w-4" />
                  <span>View Stream</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit Camera</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{camera.location}</p>
        </CardContent>
        <CardFooter className="flex justify-between p-4 pt-0">
          <Button variant="outline" size="sm" className="h-8 gap-1 rounded-full">
            <Play className="h-3 w-3" />
            View
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1 rounded-full">
            <Settings className="h-3 w-3" />
            Settings
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
