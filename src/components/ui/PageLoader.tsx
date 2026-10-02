// @ts-nocheck
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

import * as pixels from './lizardArray'

type Point = {
    x: number
    y: number
}

const allValues = Object.values(pixels)[0] as unknown as Point[][]

// Флатеним + убираем дубликаты один раз на уровне модуля
const FLAT: Point[] = (() => {
    const map = new Map<string, Point>()
    allValues.flat().forEach((c) => map.set(`${c.x},${c.y}`, c))
    return [...map.values()]
})()

console.log('cells count', FLAT.length)

const PageLoader = ({ rows = 60, cols = 60, cellSize = 20 }) => {
    const svgRef = useRef<SVGSVGElement | null>(null)

    useEffect(() => {
        const svg = d3.select(svgRef.current)
        svg.selectAll('*').remove()

        const cells = FLAT
        if (cells.length === 0) return

        // --- bounding box рисунка в пикселях ---
        const minX = d3.min(cells, (d) => d.x)!
        const maxX = d3.max(cells, (d) => d.x)!
        const minY = d3.min(cells, (d) => d.y)!
        const maxY = d3.max(cells, (d) => d.y)!

        const pad = cellSize // отступ в пол-клетки с каждой стороны
        const bx = minX * cellSize - pad
        const by = minY * cellSize - pad
        const bw = (maxX - minX + 1) * cellSize + pad * 2
        const bh = (maxY - minY + 1) * cellSize + pad * 2

        // --- viewBox центрирует содержимое внутри 100%×100% ---
        svg
            .attr('viewBox', `${bx} ${by} ${bw} ${bh}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('width', '100%')
            .attr('height', '100%')

        // ось симметрии / центр для радиальной волны
        const centerX = (minX + maxX) / 2

        svg
            .selectAll<SVGRectElement, Point>('rect')
            .data(cells, (d) => `${d.x},${d.y}`)
            .join('rect')
            .attr('x', (d) => d.x * cellSize)
            .attr('y', (d) => d.y * cellSize)
            .attr('width', cellSize)
            .attr('height', cellSize)
            .attr('fill', 'steelblue')
            .attr('opacity', 0)
            .attr('transform', (d) => {
                const cx = d.x * cellSize + cellSize / 2
                const cy = d.y * cellSize + cellSize / 2
                return `translate(${cx} ${cy}) scale(0.2) translate(${-cx} ${-cy})`
            })
            .transition()
            .duration(250)
            // зеркальный рост из центра:
            .delay((d) => Math.abs(d.x - centerX) * 60)
            // альтернативы:
            // .delay((d) => d.y * 25)                     // печать сверху вниз
            // .delay((d) => (Math.abs(d.x - centerX) + d.y * 0.3) * 40) // комбо
            .attr('opacity', 1)
            .attr('transform', 'translate(0 0) scale(1)')
            .ease(d3.easeCubicOut)
    }, [rows, cols, cellSize])

    return (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <svg
                ref={svgRef}
                style={{ display: 'block', width: '100%', height: '100%' }}
            />
        </div>
    )
}

export default PageLoader