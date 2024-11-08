extends Resource

class_name Phase

@export var type: String

@export var timeAlotted: int
@export var timeRemaining: int


func _init() -> void:
	timeRemaining = timeAlotted  #TODO: Remove/Clean up
