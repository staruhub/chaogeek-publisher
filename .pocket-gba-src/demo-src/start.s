.syntax unified
.cpu arm7tdmi
.arm
.section .text.start,"ax"
.global _start
_start:
 b boot
 .space 156
 .ascii "POCKET TEST "
 .ascii "PKTE"
 .ascii "01"
 .byte 0x96,0,0
 .space 7
 .byte 0,0
 .space 2
boot:
 mov r0, #0x1f
 msr cpsr_c, r0
 ldr sp, =0x03007f00
 bl main
1: b 1b
