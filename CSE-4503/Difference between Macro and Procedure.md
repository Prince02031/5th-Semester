While both provides code reusuablity, their main differences are:

**Macro:** Uses the same memory location as where it is called, meaning the macro code is appended on that caller place. Macro is usually defined at the beginning of a program

**Procedure:** Stored in seperate memory location. When called, the program jumps to that location to execute the instructions in that procedure.


**Task 1 solution:**

`.MODEL SMALL`
`.STACK 100H`


`PRINT_STR MACRO STRING`
    `MOV AH,09H`
    `LEA DX, STRING`
    `INT 21H`
`ENDM`

 
 
`MACARRAY MACRO DIGIT_VAL, ARR_ADDR, ARR_LEN`
    `MOV AL, DIGIT_VAL`
    `LEA SI, ARR_ADDR`
    `MOV CX, ARR_LEN`
    `CALL SEARCH_PROC`
`ENDM`


`.DATA`   

    `ARRAY DB 2,0,4,7,1,9`
    `ARR_LENGTH DW 6`
              
    `INPUT_CHAR DB ?`
    
    `MSG_INPUT DB 'INPUT: $'`
    `MSG_OUT_FOUND DB 0DH, 0AH, 'OUTPUT: DIGIT $'`
    `MSG_FOUND_SUFFIX DB ' FOUND$'` 
    
    `MSG_OUT_NOT_FOUND DB 0DH, 0AH, 'OUTPUT: DIGIT $'`
    `MSG_NOT_FOUND_SUFFIX DB ' NOT FOUND$'`
                                    


`.CODE` 

`MAIN PROC`
    
    `MOV AX, @DATA`
    `MOV DS, AX`  
    
    `PRINT_STR MSG_INPUT`
    
    `MOV AH, 01H`
    `INT 21H`
    `MOV INPUT_CHAR, AL`
    
    `SUB AL,30H`
    
    `MACARRAY AL, ARRAY, ARR_LENGTH`
    
    `MOV AH, 4CH`
    `INT 21H`
     
    
    
    `MAIN ENDP`

`SEARCH_PROC PROC`
    `MOV BL, AL`
    
    `SEARCH_LOOP:`
    `MOV AL , [SI]`
    `CMP AL, BL`
    `JE FOUND`
    `INC SI`
    `LOOP SEARCH_LOOP`
    
    `NOT_FOUND:`
    
    `PRINT_STR MSG_OUT_NOT_FOUND`
    `MOV AH, 02H`
    `MOV DL, INPUT_CHAR`
    `INT 21H`
    `PRINT_STR MSG_NOT_FOUND_SUFFIX`
    `RET`
    
    `FOUND:`
    `PRINT_STR MSG_OUT_FOUND`
    `MOV AH, 02H`
    `MOV DL, INPUT_CHAR`
    `INT 21H`
    `PRINT_STR MSG_FOUND_SUFFIX`
    `RET`
    
    `SEARCH_PROC ENDP`





`END MAIN`
                   

**Explanation:**


