import * as React from "react"

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => <button ref={ref} {...props} />)
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"
export const DropdownMenuContent = ({ children }: { children: React.ReactNode }) => <div className="absolute bg-white border rounded shadow-lg">{children}</div>
export const DropdownMenuItem = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>
export const DropdownMenuLabel = ({ children }: { children: React.ReactNode }) => <div className="font-bold px-2 py-1">{children}</div>
export const DropdownMenuSeparator = () => <hr className="my-1" /> 