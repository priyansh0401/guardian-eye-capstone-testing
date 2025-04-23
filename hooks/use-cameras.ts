"use client"
import type { Camera } from "@/types/camera"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

// Mock data for demo purposes
const mockCameras: Camera[] = [
  {
    id: "1",
    name: "Front Door",
    ip_address: "192.168.1.100",
    location: "Front Entrance",
    description: "Camera monitoring the front entrance",
    status: "online",
    thumbnail: "/placeholder.svg?height=200&width=300",
    camera_type: "ip",
    enable_motion_detection: true,
    enable_sound_detection: false,
    stream_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Backyard",
    ip_address: "192.168.1.101",
    location: "Backyard",
    description: "Camera monitoring the backyard",
    status: "online",
    thumbnail: "/placeholder.svg?height=200&width=300",
    camera_type: "rtsp",
    enable_motion_detection: true,
    enable_sound_detection: true,
    stream_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Garage",
    ip_address: "192.168.1.102",
    location: "Garage",
    description: "Camera monitoring the garage area",
    status: "offline",
    thumbnail: null,
    camera_type: "ip",
    enable_motion_detection: true,
    enable_sound_detection: false,
    stream_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Living Room",
    ip_address: "192.168.1.103",
    location: "Living Room",
    description: "Indoor camera for the living room",
    status: "online",
    thumbnail: "/placeholder.svg?height=200&width=300",
    camera_type: "onvif",
    enable_motion_detection: true,
    enable_sound_detection: true,
    stream_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Kitchen",
    ip_address: "192.168.1.104",
    location: "Kitchen",
    description: "Camera monitoring the kitchen area",
    status: "online",
    thumbnail: "/placeholder.svg?height=200&width=300",
    camera_type: "ip",
    enable_motion_detection: false,
    enable_sound_detection: true,
    stream_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function useCameras() {
  const [error, setError] = useState<Error | null>(null)

  const {
    data: cameras,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["cameras"],
    queryFn: async () => {
      try {
        // In a real app, this would call the API to fetch cameras
        // const response = await api.get("/api/cameras")
        // return response.data

        // For demo purposes, we'll just return mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return mockCameras
      } catch (err) {
        if (err instanceof Error) {
          setError(err)
        } else {
          setError(new Error("Failed to fetch cameras"))
        }
        return []
      }
    },
  })

  return {
    cameras,
    isLoading,
    error,
    refetch,
  }
}

export function useCamera(id: string) {
  const [error, setError] = useState<Error | null>(null)

  const {
    data: camera,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["camera", id],
    queryFn: async () => {
      try {
        // In a real app, this would call the API to fetch a specific camera
        // const response = await api.get(`/api/cameras/${id}`)
        // return response.data

        // For demo purposes, we'll just return mock data
        await new Promise((resolve) => setTimeout(resolve, 500))
        const camera = mockCameras.find((c) => c.id === id)
        if (!camera) {
          throw new Error("Camera not found")
        }
        return camera
      } catch (err) {
        if (err instanceof Error) {
          setError(err)
        } else {
          setError(new Error("Failed to fetch camera"))
        }
        throw err
      }
    },
  })

  return {
    camera,
    isLoading,
    error,
    refetch,
  }
}

export function useTestCameraConnection() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [result, setResult] = useState<any>(null)

  const testConnection = async (ip_address: string, camera_type = "ip") => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // In a real app, this would call the API to test the camera connection
      // const response = await api.post("/api/cameras/test-connection", { ip_address, camera_type })
      // setResult(response.data)

      // For demo purposes, we'll just simulate a successful connection
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Randomly succeed or fail for demo purposes
      const success = Math.random() > 0.3

      if (success) {
        setResult({
          ip_address,
          url: ip_address.startsWith(("rtsp://", "http://", "https://")) ? ip_address : `http://${ip_address}`,
          is_reachable: true,
          status: "online",
        })
      } else {
        throw new Error("Could not connect to camera. Please check the IP address and try again.")
      }

      return success
    } catch (err) {
      if (err instanceof Error) {
        setError(err)
      } else {
        setError(new Error("Failed to test camera connection"))
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    testConnection,
    isLoading,
    error,
    result,
  }
}
