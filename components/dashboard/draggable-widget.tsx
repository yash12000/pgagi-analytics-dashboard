"use client"

import type React from "react"

import { useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { cn } from "../../lib/utils"

interface DraggableWidgetProps {
  id: string
  index: number
  moveWidget: (dragIndex: number, hoverIndex: number) => void
  children: React.ReactNode
}

interface DragItem {
  index: number
  id: string
  type: string
}

export function DraggableWidget({ id, index, moveWidget, children }: DraggableWidgetProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: "WIDGET",
    item: () => {
      return { id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ handlerId }, drop] = useDrop({
    accept: "WIDGET",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      const clientOffset = monitor.getClientOffset()

      const hoverClientY = clientOffset!.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveWidget(dragIndex, hoverIndex)

      item.index = hoverIndex
    },
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      className={cn(
        "cursor-move rounded-lg border bg-card text-card-foreground shadow transition-opacity",
        isDragging ? "opacity-50" : "opacity-100",
      )}
      data-handler-id={handlerId}
    >
      {children}
    </div>
  )
}
