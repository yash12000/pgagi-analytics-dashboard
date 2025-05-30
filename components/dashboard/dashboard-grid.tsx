"use client"

import { type ReactNode, useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { DraggableWidget } from "./draggable-widget"

interface DashboardGridProps {
  children: ReactNode
}

export function DashboardGrid({ children }: DashboardGridProps) {
  const [widgets, setWidgets] = useState<ReactNode[]>(Array.isArray(children) ? children : [children])

  const moveWidget = (dragIndex: number, hoverIndex: number) => {
    const draggedWidget = widgets[dragIndex]
    const newWidgets = [...widgets]
    newWidgets.splice(dragIndex, 1)
    newWidgets.splice(hoverIndex, 0, draggedWidget)
    setWidgets(newWidgets)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {widgets.map((widget, index) => (
          <DraggableWidget key={index} index={index} moveWidget={moveWidget} id={`widget-${index}`}>
            {widget}
          </DraggableWidget>
        ))}
      </div>
    </DndProvider>
  )
}
